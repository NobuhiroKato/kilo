import * as React from 'react';
import * as moment from 'moment';
import {
  Modal,
  Table,
  Badge,
} from 'components';
import { CEvent, Lesson, LessonClass } from 'responses/responseStructs';
import { joinLesson, leaveLesson } from 'request/methods/lessons';
import { useSnackbar } from 'notistack';
import showEventModalStyle from 'assets/jss/kiloStyles/showEventModalStyle';
import { AuthContext } from 'Auth';

interface Props {
  open: boolean;
  selectedEvent: CEvent|undefined;
  closeFunc: Function;
  updateEventFunc: Function;
}

const ShowEventModal: React.FC<Props> = (props) => {
  const { open, selectedEvent, closeFunc, updateEventFunc } = props;
  const { enqueueSnackbar } = useSnackbar();
  const lessonId = selectedEvent?.id;
  const classes = showEventModalStyle();
  const ctx = React.useContext(AuthContext);
  const [message, setMessage] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const updateEvent = (lesson:Lesson) => {
    const newEvent:CEvent = {
      id: lesson.id,
      title: lesson.name,
      start: new Date(lesson.start_at),
      end:   new Date(lesson.end_at),
      lesson_class_id: lesson.lesson_class_id,
      color: lesson.color,
      joined: lesson.joined,
      description: lesson.description ? lesson.description : "",
      users: lesson.users ? lesson.users : undefined,
      location: lesson.location,
      price: lesson.price,
      for_children: lesson.for_children,
      user_limit_count: lesson.user_limit_count,
      remaining_user_count: lesson.remaining_user_count,
    }
    updateEventFunc(newEvent);
  };

  // 参加ボタンが押せない条件
  const isButtonDisable = () => {
    // 現在のユーザが存在しない場合
    if (!ctx.currentUser || !selectedEvent) {
      setDisabled(true);
      setMessage("不明なエラーが発生しました。この問題はリロードすることで改善する可能性があります。");
      return;
    }
    // 体験ユーザの場合
    if (ctx.currentUser.role.name === "trial") {
      setDisabled(true);
      setMessage("体験中は他のレッスンへの参加/取り消しはできません。");
      return;
    }
    // 過去もしくは当日ののイベントに対してのアクションの場合
    if (moment().isAfter(moment(selectedEvent.start).startOf('day'))) {
      setDisabled(true);
      setMessage("過去または当日のレッスンへ参加/取り消しはできません。");
      return;
    }
    // ユーザが参加できないクラスの場合
    const canJoin = (lessonClass: LessonClass) => {
      return lessonClass.id === selectedEvent.lesson_class_id
    }
    if (!ctx.currentUser.user_lesson_classes.find(canJoin)) {
      setDisabled(true);
      setMessage("現在のコースでは参加できないレッスンです。");
      return;
    }
    // レッスンの参加できる人数を超えている場合かつ自身が参加していない場合
    if (selectedEvent.remaining_user_count <= 0 && !selectedEvent.joined) {
      setDisabled(true);
      setMessage("定員を超えているため参加できません。");
      return;
    }
    setDisabled(false);
    setMessage("");
  };

  React.useEffect(() => {
    isButtonDisable();
  }, [selectedEvent]);

  return(
    <Modal
      open={open}
      headerTitle="レッスン詳細"
      content={
        <div>
          <div>
            {/* 種類のバッジ */}
            <Badge color="info">{selectedEvent?.for_children ? "子供コース" : "大人コース"}</Badge>
            {/* 無料のバッジ */}
            { selectedEvent?.price == 0 ? (
              <Badge color="success">無料</Badge>
            ) : (null)}
            {/* 参加中のバッジ */}
            { selectedEvent?.joined ? (
              <Badge color="primary">参加中のレッスン</Badge>
            ) : (null)}
          </div>
          <Table
            tableData={
              // 大人コースの場合のみ料金を表示
              selectedEvent?.for_children ? (
                [
                  ["クラス名", selectedEvent?.title],
                  ["開催場所", selectedEvent?.location],
                  ["開始時間", moment(selectedEvent?.start).format("YYYY年 MM月 DD日 H時 m分")],
                  ["終了時間", moment(selectedEvent?.end).format("YYYY年 MM月 DD日 H時 m分")],
                ]
              ) : (
                [
                  ["クラス名", selectedEvent?.title],
                  ["開催場所", selectedEvent?.location],
                  ["開始時間", moment(selectedEvent?.start).format("YYYY年 MM月 DD日 H時 m分")],
                  ["終了時間", moment(selectedEvent?.end).format("YYYY年 MM月 DD日 H時 m分")],
                  ["料金", selectedEvent?.price === 0 ? "無料" : `${selectedEvent?.price.toLocaleString()} 円`]
                ]
              )
            }
          />
          <div className={classes.descriptionContainer}>
            <p>クラス説明</p>
            <p>{selectedEvent?.description}</p>
          </div>
          {/* 参加/取り消しボタンが押せない場合のメッセージ */}
          <div>
            <p className={classes.joinMessage}>{message}</p>
          </div>
        </div>
      }
      submitText={selectedEvent?.joined ? "参加取り消し" : "参加"}
      submitFunc={selectedEvent?.joined ?
        async () => {await leaveLesson(enqueueSnackbar, updateEvent, ctx, lessonId)} :
        async () => {await joinLesson(enqueueSnackbar, updateEvent, ctx, lessonId)}
      }
      closeFunc={() => {closeFunc()}}
      // 選択したレッスンが過去の場合はボタンを無効に
      disabled={disabled}
    />
  );
};

export default ShowEventModal;