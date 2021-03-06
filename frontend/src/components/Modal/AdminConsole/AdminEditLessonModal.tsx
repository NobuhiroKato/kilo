import * as React from 'react';
import { Modal, Table, AdminEventUsersInput, ItemGrid, Button, AdminConfirmLessonModal, AdminFormInput, CustomDropDown } from 'components';
import { CEvent, User } from 'responses/responseStructs';
import { adminModalStyle, pickerTheme } from 'assets/jss/kiloStyles/adminModalStyle';
import { ThemeProvider, Grid } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import * as moment from 'moment';
import { useSnackbar } from 'notistack';
import { ValidationReturn, requireValidation } from 'assets/lib/validations';
import { LessonColor, lessonColorSets, colorCheck } from 'assets/lib/lessonColors';
import { deleteLesson } from 'request/methods/lessons';

interface Props {
  open: boolean;
  openFunc: Function;
  closeFunc: Function;
  selectedEvent: CEvent;
  users: User[];
  updateFunc?: Function;
  isAddEvent?: boolean;
  cancelFunc?: Function;
};

interface CustomDropDownColor {
  value: LessonColor;
  display_name: string;
  error: string | undefined;
};

const AdminEditLessonModal: React.FC<Props> = (props) => {
  const { open, openFunc, closeFunc, selectedEvent, users, updateFunc, isAddEvent, cancelFunc } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [startAt, setStartAt] = React.useState<moment.Moment|null>(moment(selectedEvent?.start));
  const [endAt, setEndAt] = React.useState<moment.Moment|null>(moment(selectedEvent?.end));
  const [joinedUsers, setJoinedUsers] = React.useState(selectedEvent?.users);
  const [name, setName] = React.useState<ValidationReturn>({value: selectedEvent?.title, error: undefined});
  const [description, setDescription] = React.useState<ValidationReturn>({value: selectedEvent?.description, error: undefined});
  const [price, setPrice] = React.useState<ValidationReturn>({value: 0, error: undefined});
  const [location, setLocation] = React.useState<ValidationReturn>({value: selectedEvent?.location, error: undefined})
  const [color, setColor] = React.useState({value: selectedEvent?.color, display_name: colorCheck(selectedEvent?.color).colorName, error: undefined} as CustomDropDownColor);
  const [forChildren, setForChildren] = React.useState({value: -1, display_name: '種類を選択'});
  const [userLimitCount, setUserLimitCount] = React.useState<ValidationReturn>({value: 100, error: undefined});
  const [lessonClassId, setLessonClassId] = React.useState(selectedEvent?.lesson_class_id);
  const forChildrenSets = [{value: 0, display_name: '大人コース'}, {value: 1, display_name: '子供コース'}];
  const lessonId = selectedEvent.id;
  const classes = adminModalStyle();

  const addJoinedUser = (user:User) => {
    if (joinedUsers?.some((jUser) => jUser.id == user.id)) {
      return;
    };

    const newJoindUsers = joinedUsers?.filter((ju) => true);
    newJoindUsers?.push(user);
    setJoinedUsers(newJoindUsers);
  };

  const removeJoinedUsers = (user:User) => {
    if (!joinedUsers) return;

    const newJoindUsers = joinedUsers.slice();
    const userIndex = joinedUsers.findIndex((jUser:User) => jUser.id === user.id);
    newJoindUsers.splice(userIndex, 1);

    setJoinedUsers(newJoindUsers);
  };

  const doCancel = () => {
    // confirm で修正を押したときに Confirm を閉じてから Edit を開き直す
    setOpenConfirm(false);
    openFunc();
  };


  const deleteLessonFunc = async () => {
    if (confirm(`選択中のレッスン ID:${lessonId}）を本当に削除しますか？`)) {
      await deleteLesson(lessonId, selectedEvent, enqueueSnackbar, updateFunc);
      closeFunc();
    };
  };

  // レッスンカラー用の div を追加する
  const lessonColorDiv = (color: LessonColor) => {
    const colorCode = colorCheck(color).colorCode;
    const style = {
      backgroundColor: colorCode,
      borderRadius: '3px',
      height: '41px',
      width: '100px',
      margin: 'auto 0px auto 10px'
    }

    return (
      <div style={style} />
    );
  };

  const content =
    <div>
      {/* レッスン編集の時のみ削除ボタンを追加する */}
      { isAddEvent == undefined && (
        <Button
          color="danger"
          className={classes.deleteButton}
          onClick={async () => await deleteLessonFunc()}
        >
          レッスンを削除
        </Button>
      )}
      <ThemeProvider theme={pickerTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Table
            tableData={[
              [
                "クラス名",
                <AdminFormInput
                  labelText="クラス名"
                  inputType="text"
                  onChangeFunc={(value:string) => {setName({value: value, error: requireValidation(value)})}}
                  value={name.value}
                  required
                  errorText={name.error}
                  formControlProps={{className: classes.locationForm}}
                />
              ],
              [
                "開催場所",
                <AdminFormInput
                  labelText="開催場所"
                  inputType="text"
                  onChangeFunc={(value:string) => {setLocation({value: value, error: requireValidation(value)})}}
                  value={location.value}
                  required
                  errorText={location.error}
                  formControlProps={{className: classes.locationForm}}
                />
              ],
              [
                "開始時間",
                <DateTimePicker
                  showTodayButton
                  todayLabel="現在時刻"
                  okLabel="決定"
                  cancelLabel="キャンセル"
                  value={startAt}
                  format="YYYY年 MM月 DD日 H時 m分"
                  onChange={setStartAt}
                  ampm={false}
                  className={classes.pickerCell}
                />
              ],
              [
                "終了時間",
                <DateTimePicker
                  showTodayButton
                  todayLabel="現在時刻"
                  okLabel="決定"
                  cancelLabel="キャンセル"
                  value={endAt}
                  format="YYYY年 MM月 DD日 H時 m分"
                  onChange={setEndAt}
                  ampm={false}
                  className={classes.pickerCell}
                />
              ],
              [
                "料金",
                <AdminFormInput
                  labelText="料金"
                  inputType="number"
                  onChangeFunc={(value:string) => {setPrice({value: value, error: requireValidation(value)})}}
                  value={price.value}
                  required
                  errorText={price.error}
                  formControlProps={{className: classes.locationForm}}
                />
              ],
              [
                "参加できる人数",
                <AdminFormInput
                  labelText="参加できる人数"
                  inputType="number"
                  onChangeFunc={(value:string) => {setUserLimitCount({value: value, error: requireValidation(value)})}}
                  value={userLimitCount.value}
                  required
                  errorText={userLimitCount.error}
                  formControlProps={{className: classes.locationForm}}
                />
              ],
              [
                "種類",
                <CustomDropDown
                  dropdownList={forChildrenSets}
                  hoverColor="success"
                  buttonText={forChildren.display_name}
                  onClick={setForChildren}
                  buttonProps={{color: "success", fullWidth: true}}
                  fullWidth
                />
              ],
              [
                "レッスンカラー",
                <div className={classes.flexContainer}>
                <CustomDropDown
                  dropdownList={lessonColorSets}
                  hoverColor="success"
                  buttonText={color.display_name}
                  onClick={(value:any) => setColor({value: value.name, display_name: value.display_name, error: undefined})}
                  buttonProps={{color: "success", fullWidth: true}}
                  fullWidth
                />
                {lessonColorDiv(color.value)}
              </div>
              ],
            ]}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
      <div className={classes.descriptionContainer}>
        <p>クラス説明</p>
        <AdminFormInput
          labelText="クラス説明"
          inputType="text"
          onChangeFunc={(value:string) => {setDescription({value: value, error: undefined})}}
          value={description.value}
          errorText={description.error}
          formControlProps={{className: classes.locationForm}}
          rowsMin={6}
          rowsMax={6}
        />
      </div>
      { joinedUsers ? (
        <Grid container>
          <ItemGrid xs={12} sm={6}>
            <p>参加中のユーザ一 ({joinedUsers.length})</p>
            <ul className={classes.usersContainer}>
              { joinedUsers.length == 0 ? (
                <li>なし</li>
              ) : (
                <div>
                  { joinedUsers.map((user:User) => {
                    return (
                      <li  key={user.id} className={classes.user}>
                        <p className={classes.userName}>
                          {`${user.last_name} ${user.first_name}`}
                        </p>
                        <Button
                          color="danger"
                          round
                          customClass={classes.userSelectButton}
                          onClick={() => removeJoinedUsers(user)}
                        >
                          削除
                        </Button>
                      </li>
                    )
                  })}
                </div>
              )}
            </ul>
          </ItemGrid>
          <ItemGrid xs={12} sm={6}>
            <p>ユーザ一の追加</p>
            <AdminEventUsersInput
              joinedUsers={joinedUsers}
              users={users}
              addUserFunc={(user:User) => addJoinedUser(user)}
              lessonClassId={lessonClassId}
            />
          </ItemGrid>
        </Grid>
      ) : (null) }
    </div>

  // selectedEvent が変更された際に state を更新する
  React.useEffect(() => {
    if (selectedEvent) {
      setStartAt(moment(selectedEvent.start));
      setEndAt(moment(selectedEvent.end));
      setJoinedUsers(selectedEvent.users);
      setLocation({value: selectedEvent.location, error: undefined});
      setName({value: selectedEvent.title, error: undefined});
      setDescription({value: selectedEvent.description, error: undefined});
      setColor({value: selectedEvent.color, display_name: colorCheck(selectedEvent.color).colorName, error: undefined} as CustomDropDownColor);
      setForChildren({
        value: selectedEvent.for_children ? 1 : 0,
        display_name: selectedEvent.for_children ? '子供コース' : '大人コース',
      });
      setPrice({value: selectedEvent.price, error: undefined});
      setUserLimitCount({value: selectedEvent.user_limit_count, error: undefined});
      setLessonClassId(selectedEvent.lesson_class_id);
    };
  }, [selectedEvent]);

  React.useEffect(() => {
    const userCount = joinedUsers ? joinedUsers.length : 0
    // 開始時刻が終了時刻よりも前かつ開催場所のエラーがない場合にボタンを有効化
    if (
      startAt?.isBefore(endAt) &&
      location.error == undefined && 
      name.error == undefined &&
      description.error == undefined &&
      forChildren.value != -1 &&
      price.error == undefined &&
      userCount <= userLimitCount.value
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [startAt, endAt, location, name, forChildren, price, userLimitCount, joinedUsers])

  return (
    <div>
      <Modal
        open={open}
        headerTitle={ isAddEvent ? "レッスン新規作成" : "レッスン情報変更"}
        submitText="確認"
        submitFunc={() => setOpenConfirm(true)}
        content={content}
        closeFunc={closeFunc}
        color="success"
        disabled={buttonDisabled}
        cancelText={isAddEvent ? "修正" : "キャンセル"}
        cancelFunc={isAddEvent ? cancelFunc : closeFunc}
      />
      <AdminConfirmLessonModal
        open={openConfirm}
        selectedEvent={selectedEvent}
        updateFunc={updateFunc}
        closeFunc={() => setOpenConfirm(false)}
        cancelFunc={() => doCancel()}
        startAt={startAt}
        endAt={endAt}
        joinedUsers={joinedUsers}
        location={location.value}
        name={name.value}
        description={description.value}
        price={price.value}
        userLimitCount={userLimitCount.value}
        color={color.value}
        forChildren={forChildren.value == 1 ? true : false}
        isAddEvent={isAddEvent}
      />
    </div>
  );
};

export default AdminEditLessonModal;