Faker::Config.locale = 'ja'

UserLesson.destroy_all

users = User.all
lessons = Lesson.all

30.times do |i|
  user = users.sample
  lesson = lessons.sample
  unless lesson.joined?(user)
    UserLesson.seed(:id,
                      {
                        id: i + 1,
                        user_id: user.id,
                        lesson_id: lesson.id,
                      }
    )
  end
end
