weeks = [1, 2, 3, 4]
id_num = 1

lesson_rules = LessonRule.all
lesson_rules.each do |lr|
  if lr.week == 0
    weeks.each do |week|
      date = Lesson.current_month_date_from_week_and_dotw(week, lr.dotw)
      if date
        new_start_at = Time.zone.local(date.year, date.month, date.day, lr.start_at.hour, lr.start_at.min)
        new_end_at = Time.zone.local(date.year, date.month, date.day, lr.end_at.hour, lr.end_at.min)
        Lesson.seed(:id,
          {
            id: id_num,
            lesson_class_id: lr.lesson_class_id,
            start_at: new_start_at,
            end_at: new_end_at,
          }
        )
        id_num = id_num + 1
      end
    end
  else
    date = Lesson.current_month_date_from_week_and_dotw(lr.week, lr.dotw)
    if date
      new_start_at = Time.zone.local(date.year, date.month, date.day, lr.start_at.hour, lr.start_at.min)
      new_end_at = Time.zone.local(date.year, date.month, date.day, lr.end_at.hour, lr.end_at.min)
      Lesson.seed(:id,
        {
          id: id_num,
          lesson_class_id: lr.lesson_class_id,
          start_at: new_start_at,
          end_at: new_end_at,
        }
      )
      id_num = id_num + 1
    end
  end
end