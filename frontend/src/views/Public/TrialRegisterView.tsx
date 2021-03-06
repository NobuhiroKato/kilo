import * as React from 'react';
import { KSpinner, Wizard, ItemGrid, CustomDropDown, Card, CardContent, Table, FormInput, PublicHeader } from 'components';
import { getTrialLessonClasses, getTrialLessons, sendTrial } from 'request/methods/trials';
import { CEvent, LessonClass, Lesson } from 'responses/responseStructs';
import { CreateTrialUserRequest } from 'request/requestStructs';
import trialRegisterViewStyle from 'assets/jss/kiloStyles/trialRegisterViewStyle';
import { Grid } from '@material-ui/core';
import * as moment from 'moment'; 
import { nameValidation, phoneNumberValidation, emailValidation, birthdayValidation, passwordValidation, ValidationReturn } from 'assets/lib/validations';
import { ErrorOutline, MailOutline } from '@material-ui/icons';

const TrialRegisterView: React.FC = () => {
  const [lessonClasses, setLessonClasses] = React.useState<LessonClass[] | null>();
  const [lessons, setLessons] = React.useState<CEvent[] | null>();
  const [selectedLessonClass, setSelectedLessonClass] = React.useState<LessonClass>({id: 0, name: "クラスを選択してください"} as LessonClass);
  const [selectedLesson, setSelectedLesson] = React.useState({id: 0, name: "希望日を選択してください"} as CEvent);
  const [firstName, setFirstName] = React.useState<ValidationReturn>({value: '', error: ''});
  const [lastName, setLastName] = React.useState<ValidationReturn>({value: '', error: ''});
  const [firstNameKana, setFirstNameKana] = React.useState<ValidationReturn>({value: '', error: ''});
  const [lastNameKana, setLastNameKana] = React.useState<ValidationReturn>({value: '', error: ''});
  const [email, setEmail] = React.useState<ValidationReturn>({value: '', error: ''});
  const [password, setPassword] = React.useState<ValidationReturn>({value: '', error: ''});
  const [birthday, setBirthday] = React.useState<ValidationReturn>({value: '', error: ''});
  const [phoneNumber, setPhoneNumber] = React.useState<ValidationReturn>({value: '', error: ''});
  const [submitFailed, setSubmitFailed] = React.useState(false);
  const classes = trialRegisterViewStyle();
  const navs = ["体験日の選択", "情報の入力", "情報の確認", "完了"];
  // 子供クラスの体験料
  const childTrialPrice: number = 1000;

  const sendTrialEmailFunc = async () => {
    const user = {
      last_name: lastName.value,
      first_name: firstName.value,
      last_name_kana: lastNameKana.value,
      first_name_kana: firstNameKana.value,
      email: email.value,
      password: password.value,
      birthday: birthday.value,
      phone_number: phoneNumber.value,
      lesson_id: selectedLesson.id,
    } as CreateTrialUserRequest;

    await sendTrial(user, setSubmitFailed);
  };

  // 選択されたクラスからそのクラスのレッスンを絞り込む
  const filteredLessons = () => {
    if (lessons) {
      const fCEvent = lessons.filter((lesson) => lesson.lesson_class_id == selectedLessonClass.id);
      const fLessons = fCEvent.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        start: lesson.start,
        end: lesson.end,
        lesson_class_id: lesson.lesson_class_id,
        location: lesson.location,
        price: lesson.price,
        for_children: lesson.for_children,
        name: moment(lesson.start).format("YYYY年 MM月 DD日 H時 m分"),
      } as CEvent))
      // 開始時刻で昇順に並び替え
      fLessons.sort((previous, next) => previous.start.getTime() - next.start.getTime());
      return fLessons
    }
    return []
  };

  // 希望日選択のバリデーション
  const lessonSelectValidation = () => {
    if (selectedLessonClass.id != 0 && selectedLesson.id != 0) return true
    return false
  };

  // 情報入力のバリデーション
  const dataInputValidation = () => {
    if (
      lastName.error == undefined &&
      firstName.error == undefined &&
      lastNameKana.error == undefined &&
      firstNameKana.error == undefined &&
      email.error == undefined &&
      password.error == undefined &&
      birthday.error == undefined &&
      phoneNumber.error == undefined
    ) return true
    return false
  };

  React.useEffect(() => {
    const f = async () => {
      const lessonClasses = await getTrialLessonClasses();
      if (lessonClasses) setLessonClasses(lessonClasses);
      const lessons = await getTrialLessons();
      if (lessons) {
        setLessons(lessons.map((lesson:Lesson) => ({
          id: lesson.id,
          title: lesson.name,
          start: new Date(lesson.start_at),
          end:   new Date(lesson.end_at),
          lesson_class_id: lesson.lesson_class_id,
          description: lesson.description ? lesson.description : '',
          location: lesson.location,
          price: lesson.price,
          for_children: lesson.for_children,
          user_limit_count: lesson.user_limit_count,
        } as CEvent)));
      };
    };
    f();
  }, []);

  React.useEffect(() => {
    setSelectedLesson({id: 0, name: "希望日を選択してください"} as CEvent);
  }, [selectedLessonClass]);
  
  return (
    <div>
      <PublicHeader />
      <div className={classes.wrapper}>
        <Grid container className={classes.trialView}>
          <ItemGrid xs={12} sm={8} lg={6}>
            { lessons && lessonClasses ? (
              <Wizard
                title="体験申し込み"
                navs={navs}
                contents={[
                  // 1. 希望日の選択
                  <div>
                    <div className={classes.subtitleContainer}>
                      <p>必要な項目を入力後「次へ」ボタンをクリックしてください。　* は必須項目です。</p>
                    </div>
                    <div className={classes.dropDownWrap}>
                      <p>1. 体験希望のクラスを選択してください。*</p>
                      <CustomDropDown
                        dropdownList={lessonClasses}
                        buttonText={selectedLessonClass.name}
                        hoverColor="primary"
                        onClick={setSelectedLessonClass}
                        buttonProps={{color: "primary"}}
                      />
                    </div>
                    <div className={classes.dropDownWrap}>
                      <p>2. 体験希望日を選択してください。*</p>
                      <CustomDropDown
                        dropdownList={filteredLessons()}
                        buttonText={selectedLesson.name}
                        hoverColor="primary"
                        onClick={setSelectedLesson}
                        buttonProps={{color: "primary"}}
                      />
                    </div>
                    { selectedLesson && selectedLesson.id != 0 && (
                      <Card>
                        <CardContent>
                          <Table
                            tableData={[
                              ["クラス名", selectedLesson.title],
                              ["開催場所", selectedLesson.location],
                              ["開始時間", moment(selectedLesson.start).format("YYYY年 MM月 DD日 H時 m分")],
                              ["終了時間", moment(selectedLesson.end).format("YYYY年 MM月 DD日 H時 m分")],
                              ["種類", selectedLesson.for_children ? "子供コース" : "大人コース"],
                              ["体験料金", selectedLesson.for_children ?
                                `${childTrialPrice.toLocaleString()} 円` :
                                `${selectedLesson.price.toLocaleString()} 円`
                              ]
                            ]}
                          />
                          <div>
                            <p>クラス説明</p>
                            <p>{selectedLesson.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>,
                  // 2. 情報の入力
                  <div>
                    <div className={classes.subtitleContainer}>
                      <p>必要な項目を入力後「次へ」ボタンをクリックしてください。　* は必須項目です。</p>
                    </div>
                    <div className={classes.flexContainer}>
                      <FormInput
                        labelText="名字"
                        inputType="text"
                        onChangeFunc={(value:string) => {setLastName({value: value, error: nameValidation(value)})}}
                        value={lastName.value}
                        customClass={classes.flexContainerFirst}
                        required
                        errorText={lastName.error}
                        placeholder="例：田中"
                      />
                      <FormInput
                        labelText="名前"
                        inputType="text"
                        onChangeFunc={(value:string) => {setFirstName({value: value, error: nameValidation(value)})}}
                        value={firstName.value}
                        required
                        errorText={firstName.error}
                        customClass={classes.flexContainerLast}
                        placeholder="例：太郎"
                      />
                    </div>
                    <div className={classes.flexContainer}>
                      <FormInput
                        labelText="名字（カナ）"
                        inputType="text"
                        onChangeFunc={(value:string) => {setLastNameKana({value: value, error: nameValidation(value)})}}
                        value={lastNameKana.value}
                        customClass={classes.flexContainerFirst}
                        required
                        errorText={lastNameKana.error}
                        placeholder="例：タナカ"
                      />
                      <FormInput
                        labelText="名前（カナ）"
                        inputType="text"
                        onChangeFunc={(value:string) => {setFirstNameKana({value: value, error: nameValidation(value)})}}
                        value={firstNameKana.value}
                        required
                        errorText={firstNameKana.error}
                        customClass={classes.flexContainerLast}
                        placeholder="例：タロウ"
                      />
                    </div>
                    <FormInput
                      labelText="メールアドレス"
                      inputType="email"
                      onChangeFunc={(value:string) => {setEmail({value: value, error: emailValidation(value)})}}
                      value={email.value}
                      required
                      errorText={email.error}
                      placeholder="例：example@email.com"
                    />
                    <FormInput
                      labelText="パスワード"
                      inputType="text"
                      onChangeFunc={(value:string) => {setPassword({value: value, error: passwordValidation(value)})}}
                      value={password.value}
                      required
                      errorText={password.error}
                    />
                    <FormInput
                      labelText="生年月日"
                      inputType="text"
                      onChangeFunc={(value:string) => {setBirthday({value: value, error: birthdayValidation(value)})}}
                      value={birthday.value}
                      placeholder="例：19970216"
                      required
                      errorText={birthday.error}
                    />
                    <FormInput
                      labelText="電話番号（ハイフンなし）"
                      inputType="text"
                      onChangeFunc={(value:string) => {setPhoneNumber({value: value, error: phoneNumberValidation(value)})}}
                      value={phoneNumber.value}
                      placeholder="例：00000000000"
                      required
                      errorText={phoneNumber.error}
                    />
                  </div>,
                  // 3. 情報の確認
                  <div>
                    <div className={classes.subtitleContainer}>
                      <p>以下の内容で問題なければ「確定」ボタンをクリックしてください。</p>
                    </div>
                    <FormInput
                      labelText="体験希望クラス"
                      inputType="text"
                      value={selectedLesson.title}
                      confirm
                    />
                    <FormInput
                      labelText="体験希望日"
                      inputType="text"
                      value={moment(selectedLesson.start).format("YYYY年 MM月 DD日 H時 m分")}
                      confirm
                    />
                    <div className={classes.flexContainer}>
                      <FormInput
                        labelText="名字"
                        inputType="text"
                        value={lastName.value}
                        customClass={classes.flexContainerFirst}
                        confirm
                      />
                      <FormInput
                        labelText="名前"
                        inputType="text"
                        value={firstName.value}
                        customClass={classes.flexContainerLast}
                        confirm
                      />
                    </div>
                    <div className={classes.flexContainer}>
                      <FormInput
                        labelText="名字（カナ）"
                        inputType="text"
                        value={lastNameKana.value}
                        customClass={classes.flexContainerFirst}
                        confirm
                      />
                      <FormInput
                        labelText="名前（カナ）"
                        inputType="text"
                        value={firstNameKana.value}
                        customClass={classes.flexContainerLast}
                        confirm
                      />
                    </div>
                    <FormInput
                      labelText="メールアドレス"
                      inputType="email"
                      value={email.value}
                      confirm
                    />
                    <FormInput
                      labelText="パスワード"
                      inputType="text"
                      value={password.value}
                      confirm
                    />
                    <FormInput
                      labelText="生年月日"
                      inputType="text"
                      value={moment(birthday.value).format("LL")}
                      confirm
                    />
                    <FormInput
                      labelText="電話番号"
                      inputType="text"
                      value={phoneNumber.value}
                      confirm
                    />
                  </div>,
                  // 4. 完了
                  <div>
                    { submitFailed ? (
                      <div className={classes.messageContainer}>
                        <div><ErrorOutline className={classes.icon}/></div>
                        <p>体験申し込みに失敗しました。<br/>お手数ですが最初からやり直してください。</p>
                      </div>
                    ) : (
                      <div className={classes.messageContainer}>
                        <div><MailOutline className={classes.icon}/></div>
                        <p>体験申し込みが完了しました。<br/>登録メールをご入力いただいたメールアドレスに送信しましたのでご確認ください。</p>
                      </div>
                    )}
                  </div>
                ]}
                confirmRules={[true, lessonSelectValidation(), dataInputValidation(), true]}
                submitFunc={() => sendTrialEmailFunc()}
              />
            ) : (
              <div className={classes.spinnerWrap}>
                <KSpinner color="primary"/>
              </div>
            )}
          </ItemGrid>
        </Grid>
      </div>
    </div>
  );
};

export default TrialRegisterView;