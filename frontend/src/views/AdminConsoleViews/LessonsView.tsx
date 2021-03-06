import * as React from 'react';
import * as moment from 'moment';
import {
  KSpinner, AdminCalender, Card, Button,
  CardContent, CardHeader, CardIcon, ItemGrid,
} from 'components';
import { Grid,} from '@material-ui/core';
import { getUsers } from 'request/methods/users';
import { getLessonsForAdmin } from 'request/methods/lessons';
import { getLessonClasses } from 'request/methods/lessonClasses';
import { Lesson, CEvent, User, LessonClass } from 'responses/responseStructs';
import lessonsViewStyle from 'assets/jss/kiloStyles/classesViewStyle';
import { EventNote } from '@material-ui/icons';
import { createLessons } from 'request/methods/lessons';
import { useSnackbar } from 'notistack';

type eventAction = "update" | "add" | "delete" | "createLessons";

const LessonsView: React.FC = () => {
  const [lessons, setLessons] = React.useState<CEvent[] | null>(null);
  const [users, setUsers] = React.useState<User[] | null>();
  const [lessonClasses, setLessonClasses] = React.useState<LessonClass[] | null>();
  const classes = lessonsViewStyle();
  const { enqueueSnackbar } = useSnackbar();

  const updateEvent = async (events:CEvent[], action:eventAction) => {
    if (!lessons) {
      console.log('LessonNotFoundError');
      return
    };

    const newLessons = lessons.slice();
    const selectedIndex = lessons.findIndex(({id}) => id === events[0].id);
    switch (action) {
      case "update":
        // 更新時の update
        newLessons[selectedIndex] = events[0];
        setLessons(newLessons);
        break;
      case "add":
        // 追加時の update
        newLessons.push(events[0]);
        setLessons(newLessons);
        break;
      case "delete":
        // 削除時の update
        newLessons.splice(selectedIndex, 1);
        setLessons(newLessons);
        break;
      case "createLessons":
        // 来月のスケジュール作成時の update
        setLessons(newLessons.concat(events));
        break;
    };
  };

  const createLessonsFunc = () => {
    // 来月をスケジュールを作成し、子供コースのユーザを参加させる
    const nextMonth = moment().add(1, 'month');
    if (confirm(`現在のクラスをもとに ${nextMonth.format("YYYY 年 MM 月")} のスケジュールを作成します。よろしいですか？\nまた、作成された子供コースのレッスンへ該当するユーザーが自動的に参加されます。`)) {
      createLessons(enqueueSnackbar, updateEvent);
    };
  };

  React.useEffect(() => {
    const f = async () => {
      const lessons = await getLessonsForAdmin();
      if (lessons) {
        setLessons(lessons.map((lesson:Lesson) => ({
          id: lesson.id,
          title: lesson.name,
          start: new Date(lesson.start_at),
          end:   new Date(lesson.end_at),
          lesson_class_id: lesson.lesson_class_id,
          color: lesson.color,
          joined: lesson.joined,
          description: lesson.description ? lesson.description : '',
          users: lesson.users ? lesson.users : undefined,
          location: lesson.location,
          price: lesson.price,
          for_children: lesson.for_children,
          user_limit_count: lesson.user_limit_count,
          remaining_user_count: lesson.remaining_user_count,
        } as CEvent)));
      };
      const users = await getUsers();
      if (users) setUsers(users);

      const lessonClasses = await getLessonClasses();
      if (lessonClasses) setLessonClasses(lessonClasses);
    };
    f();
  }, []);

  return (
    <Grid container>
      <ItemGrid xs={12} noPadding>
        { lessons ? (
          <div>
            <Card>
              <CardHeader color="green" icon>
                <CardIcon color="green">
                  <EventNote />
                </CardIcon>
                <h4 className={classes.cardTitle}>レッスン</h4>
                <Button
                  color="success"
                  customClass={classes.nextMonthButton}
                  onClick={() => createLessonsFunc()}
                >
                  来月の予定を作成
                </Button>
              </CardHeader>
              <CardContent className={classes.noPadding}>
                <AdminCalender
                  lessons={lessons}
                  updateEventFunc={(events:CEvent[], action:eventAction) => updateEvent(events, action)}
                  users={users ? users : []}
                  lessonClasses={lessonClasses ? lessonClasses : []}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className={classes.spinnerWrap}>
            <KSpinner color="success"/>
          </div>
        )}
      </ItemGrid>
    </Grid>
  );
};

export default LessonsView;