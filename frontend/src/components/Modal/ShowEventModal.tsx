import * as React from 'react';
import * as moment from 'moment';
import {
  Modal,
  Table,
  Badge,
} from 'components';
import { User, CEvent, Lesson, LessonClass } from 'responses/responseStructs';
import { fetchApp, NetworkError } from 'request/fetcher';
import { useSnackbar } from 'notistack';
import showEventModalStyle from 'assets/jss/kiloStyles/showEventModalStyle';
import { fetchCurrentUser, AuthContext } from 'Auth';

interface Props {
  open: boolean;
  selectedEvent: CEvent|undefined;
  isAdmin: boolean;
  closeFunc: Function;
  updateEventFunc: Function;
}

const ShowEventModal: React.FC<Props> = (props) => {
  const { open, selectedEvent, isAdmin, closeFunc, updateEventFunc } = props;
  const { enqueueSnackbar } = useSnackbar();
  const lessonId = selectedEvent?.id;
  const accessToken = localStorage.getItem('kiloToken');
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
      color: lesson.color,
      joined: lesson.joined,
      description: lesson.description ? lesson.description : "",
      users: lesson.users ? lesson.users : undefined,
      location: lesson.location,
      price: lesson.price,
      for_children: lesson.for_children,
    }
    updateEventFunc(newEvent);
  };

  const isButtonDisable = () => {
    // 現在のユーザが存在しない場合
    if (!ctx.currentUser) {
      setDisabled(true);
      setMessage("不明なエラーが発生しました。この問題はリロードすることで改善する可能性があります。");
      return;
    }
    // 過去のイベントに対してのアクションの場合
    if (moment(new Date).isAfter(moment(selectedEvent?.start))) {
      setDisabled(true);
      setMessage("過去のレッスンの参加/取り消しはできません。");
      return;
    }
    // ユーザが参加できないクラスの場合
    const canJoin = (lessonClass: LessonClass) => {
      return lessonClass.id === selectedEvent?.lesson_class_id
    }
    if (!ctx.currentUser.user_lesson_classes.find(canJoin)) {
      setDisabled(true);
      setMessage("現在のコースでは参加できないレッスンです。");
      return;
    }
    setDisabled(false);
    setMessage("");
  };

  const handleSubmitJoin = async () => {
    if (!accessToken) {
      return;
    }
    const res = await fetchApp(
      `/v1/lessons/${lessonId}/join`,
      'POST',
      accessToken,
    )
    if (res instanceof NetworkError) {
      console.log('ServerError');
      enqueueSnackbar('予期せぬエラーが発生しました。時間をおいて再度お試しください。', { variant: 'error' });
      return;
    }
    const json = await res.json();
    switch (res.status) {
      case 200:
        await fetchCurrentUser(ctx);
        updateEvent(json);
        enqueueSnackbar('レッスンへの参加が成功しました。', { variant: 'success' });
        break;
      case 400:
        switch (json.code) {
          case 'user_already_joined':
            enqueueSnackbar('既に参加済みのレッスンへは参加できません。', { variant: 'error' });
            break;
          case 'cant_join_to_past_lesson':
            enqueueSnackbar('過去のレッスンへは参加できません。', { variant: 'error' });
            break;
          case 'cant_join_to_this_lesson':
            enqueueSnackbar('現在のコースではこのレッスンへ参加できません。', { variant: 'error' });
            break;
          default:
            enqueueSnackbar('レッスンへの参加に失敗しました。', { variant: 'error' });
        };
        break;
      default:
        enqueueSnackbar('レッスンへの参加に失敗しました。', { variant: 'error' });
    }
  };

  const handleSubmitLeave = async () => {
    if (!accessToken) {
      return;
    }
    const res = await fetchApp(
      `/v1/lessons/${lessonId}/leave`,
      'DELETE',
      accessToken,
    )
    if (res instanceof NetworkError) {
      console.log('ServerError');
      enqueueSnackbar('予期せぬエラーが発生しました。時間をおいて再度お試しください。', { variant: 'error' });
      return;
    }
    const json = await res.json();
    switch (res.status) {
      case 200:
        await fetchCurrentUser(ctx);
        updateEvent(json);
        enqueueSnackbar('レッスンへの参加取り消しが成功しました。', { variant: 'success' });
        break;
      case 400:
        switch (json.code) {
          case 'user_not_joined':
            enqueueSnackbar('参加していないレッスンを取り消すことはできません。', { variant: 'error' });
            break;
          case 'cant_leave_to_past_lesson':
            enqueueSnackbar('過去のレッスンへの参加を取り消すことはできません。', { variant: 'error' });
            break;
          default:
            enqueueSnackbar('レッスンへの参加取り消しに失敗しました。', { variant: 'error' });
        };
        break;
      default:
        enqueueSnackbar('レッスンへの参加取り消しに失敗しました。', { variant: 'error' });
    }
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
            tableData={[
              ["クラス名", selectedEvent?.title],
              ["開催場所", selectedEvent?.location],
              ["開始時間", moment(selectedEvent?.start).format("YYYY年 MM月 DD日 H時 m分")],
              ["終了時間", moment(selectedEvent?.end).format("YYYY年 MM月 DD日 H時 m分")],
            ]}
          />
          <div className={classes.descriptionContainer}>
            <p>クラス説明</p>
            <p>{selectedEvent?.description}</p>
          </div>
          { isAdmin && selectedEvent?.users ? (
            <div>
              <p>参加中のユーザ一</p>
              <ul className={classes.usersContainer}>
                { selectedEvent.users.length == 0 ? (
                  <li>なし</li>
                ) : (
                  <div>
                    { selectedEvent.users.map((user:User) => {
                      return <li key={user.id}>{user.last_name + " " + user.first_name}</li>
                    })}
                  </div>
                )}
              </ul>
            </div>
          ) : (null) }
          {/* 参加/取り消しボタンが押せない場合のメッセージ */}
          <div>
            <p className={classes.joinMessage}>{message}</p>
          </div>
        </div>
      }
      submitText={selectedEvent?.joined ? "参加取り消し" : "参加"}
      submitFunc={selectedEvent?.joined ?
        async () => {await handleSubmitLeave()} :
        async () => {await handleSubmitJoin()}
      }
      closeFunc={() => {closeFunc()}}
      // 選択したレッスンが過去の場合はボタンを無効に
      disabled={disabled}
    />
  );
};

export default ShowEventModal;