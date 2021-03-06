require 'rails_helper'

describe 'LessonClasses API', type: :request do
  let(:json){ JSON.parse response.body }
  describe 'GET /api/v1/lesson_classes' do
    subject { get '/api/v1/lesson_classes', headers: { Authorization: access_token }  }
    context '管理者がクラス一覧を取得した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:last_lesson_class){ LessonClass.last }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        expect(json.is_a?(Array)).to eq true
        expect(json.last['id']).to eq last_lesson_class.id
        expect(json.last['name']).to eq last_lesson_class.name
        expect(json.last['location']).to eq last_lesson_class.location
        expect(json.last['description']).to eq last_lesson_class.description
        expect(json.last['color']).to eq last_lesson_class.color
        expect(json.last['price']).to eq last_lesson_class.price
        expect(json.last['for_children']).to eq last_lesson_class.for_children
        expect(json.last['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json.last['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json.last['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json.last['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json.last['lesson_rules']).to eq []
        end
      end
    end

    context 'ユーザがクラス一覧を取得した場合' do
      login_user
      let(:access_token){ user.access_token }
      let(:last_lesson_class){ LessonClass.last }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        expect(json.is_a?(Array)).to eq true
        expect(json.last['id']).to eq last_lesson_class.id
        expect(json.last['name']).to eq last_lesson_class.name
        expect(json.last['location']).to eq last_lesson_class.location
        expect(json.last['description']).to eq last_lesson_class.description
        expect(json.last['color']).to eq last_lesson_class.color
        expect(json.last['price']).to eq last_lesson_class.price
        expect(json.last['for_children']).to eq last_lesson_class.for_children
        expect(json.last['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json.last['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json.last['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json.last['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json.last['lesson_rules']).to eq []
        end
      end
    end

    context '体験ユーザがクラス一覧を取得した場合' do
      login_trial_user
      let(:access_token){ trial_user.access_token }
      let(:last_lesson_class){ LessonClass.last }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        expect(json.is_a?(Array)).to eq true
        expect(json.last['id']).to eq last_lesson_class.id
        expect(json.last['name']).to eq last_lesson_class.name
        expect(json.last['location']).to eq last_lesson_class.location
        expect(json.last['description']).to eq last_lesson_class.description
        expect(json.last['color']).to eq last_lesson_class.color
        expect(json.last['price']).to eq last_lesson_class.price
        expect(json.last['for_children']).to eq last_lesson_class.for_children
        expect(json.last['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json.last['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json.last['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json.last['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json.last['lesson_rules']).to eq []
        end
      end
    end
  end

  describe 'POST /api/v1/lesson_classes' do
    subject { post '/api/v1/lesson_classes', params: { lesson_class: lesson_class_params },
                   headers: { Authorization: access_token } }
    let(:lesson_class_params){ {
      name: Faker::Address.city,
      location: Faker::University.name,
      description: Faker::Lorem.paragraph(sentence_count: 20),
      color: lesson_colors.sample,
      price: rand(1000..5000),
      for_children: Faker::Boolean.boolean,
      user_limit_count: rand(1..100),
      lesson_rules: [
        { dotw: rand(0..6), week: rand(0..4), start_at: Time.current, end_at: Time.current + 1.hours },
        { dotw: rand(0..6), week: rand(0..4), start_at: Time.current, end_at: Time.current + 1.hours }
                     ]
    } }
    let(:lesson_colors){ ['', 'rose', 'green', 'azure', 'orange'] }
    context '管理者がクラスを作成した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      it '201 Created を返す' do
        expect{subject}.to change{ LessonClass.count }.by(1)
        expect(response.status).to eq 201
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json['lesson_rules']).to eq []
        end
      end
    end

    context '管理者が形式の正しくないクラスを作成した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        dotw: nil,
        lesson_rules:  [{ dotw: 0, start_at: Time.current, end_at: Time.current + 1.hours }]
      } }
      it '422 Unprocessable Entity を返す' do
        expect{subject}.to change{ LessonClass.count }.by(0)
        expect(response.status).to eq 422
        expect(json['code']).to eq 'lesson_class_create_error'
      end
    end

    context '管理者がルールに重複のあるクラスを作成した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        name: Faker::Address.city,
        location: Faker::University.name,
        description: Faker::Lorem.paragraph(sentence_count: 20),
        color: lesson_colors.sample,
        price: rand(1000..5000),
        for_children: Faker::Boolean.boolean,
        user_limit_count: rand(1..100),
        lesson_rules: [
          { dotw: 0, week: 0, start_at: Time.current, end_at: Time.current + 1.hours },
          { dotw: 0, week: 0, start_at: Time.current, end_at: Time.current + 1.hours }
        ]
      } }
      it '422 Unprocessable Entity を返す' do
        expect{subject}.to change{ LessonClass.count }.by(0)
        expect(response.status).to eq 422
        expect(json['code']).to eq 'lesson_rule_invalid_error'
      end
    end

    context '管理者がルールの存在しないクラスを作成した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        name: Faker::Address.city,
        location: Faker::University.name,
        description: Faker::Lorem.paragraph(sentence_count: 20),
        color: lesson_colors.sample,
        price: rand(1000..5000),
        for_children: Faker::Boolean.boolean,
        user_limit_count: rand(1..100),
        lesson_rules: []
      } }
      it '201 Created を返す' do
        expect{subject}.to change{ LessonClass.count }.by(1)
        expect(response.status).to eq 201
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        expect(json['lesson_rules']).to eq []
      end
    end

    context 'ユーザがクラスを作成した場合' do
      login_user
      let(:access_token){ user.access_token }
      it '403 Forbidden を返す' do
        expect{subject}.to change{ LessonClass.count }.by(0)
        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end

    context '体験ユーザがクラスを作成した場合' do
      login_trial_user
      let(:access_token){ trial_user.access_token }
      it '403 Forbidden を返す' do
        expect{subject}.to change{ LessonClass.count }.by(0)
        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end
  end

  describe 'PATCH /api/v1/lesson_classes/:id' do
    subject { patch "/api/v1/lesson_classes/#{lesson_class_id}", params: { lesson_class: lesson_class_params },
                   headers: { Authorization: access_token } }
    let(:lesson_class_params){ {
      name: Faker::Address.city,
      location: Faker::University.name,
      description: Faker::Lorem.paragraph(sentence_count: 20),
      color: lesson_colors.sample,
      price: rand(1000..5000),
      for_children: Faker::Boolean.boolean,
      user_limit_count: rand(1..100),
      lesson_rules: [
        { dotw: rand(0..6), week: rand(0..4), start_at: Time.current, end_at: Time.current + 1.hours },
        { dotw: rand(0..6), week: rand(0..4), start_at: Time.current, end_at: Time.current + 1.hours }
                     ]
    } }
    let(:lesson_colors){ ['', 'rose', 'green', 'azure', 'orange'] }
    context '管理者がクラス情報を変更した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_id){ LessonClass.last.id }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json['lesson_rules']).to eq []
        end
      end
    end

    context '管理者が形式の正しくないクラス情報へ変更した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        name: nil,
        lesson_rules:  [{ dotw: 0, start_at: Time.current, end_at: Time.current + 1.hours }]
      } }
      let(:lesson_class_id){ LessonClass.last.id }
      it '422 Unprocessable Entity を返す' do
        subject

        expect(response.status).to eq 422
        expect(json['code']).to eq 'lesson_class_update_error'
      end
    end

    context '管理者がルールに重複のあるクラス情報へ変更した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        name: Faker::Address.city,
        location: Faker::University.name,
        description: Faker::Lorem.paragraph(sentence_count: 20),
        color: lesson_colors.sample,
        price: rand(1000..5000),
        for_children: Faker::Boolean.boolean,
        user_limit_count: rand(1..100),
        lesson_rules: [
          { dotw: 0, week: 0, start_at: Time.current, end_at: Time.current + 1.hours },
          { dotw: 0, week: 0, start_at: Time.current, end_at: Time.current + 1.hours }
        ]
      } }
      let(:lesson_class_id){ LessonClass.last.id }
      it '422 Unprocessable Entity を返す' do
        subject

        expect(response.status).to eq 422
        expect(json['code']).to eq 'lesson_rule_invalid_error'
      end
    end

    context '管理者がルールの存在しないクラス情報へ変更した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_params){ {
        name: Faker::Address.city,
        location: Faker::University.name,
        description: Faker::Lorem.paragraph(sentence_count: 20),
        color: lesson_colors.sample,
        price: rand(1000..5000),
        for_children: Faker::Boolean.boolean,
        user_limit_count: rand(1..100),
        lesson_rules: []
      } }
      let(:lesson_class_id){ LessonClass.last.id }
      it '200 OK を返す' do
        expect{subject}.to change{ LessonClass.count }.by(0)
        expect(response.status).to eq 200
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        expect(json['lesson_rules']).to eq []
      end
    end

    context '管理者が存在しないクラス情報を変更した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_class_id){ LessonClass.last.id + 1 }
      it '404 Not Found を返す' do
        subject

        expect(response.status).to eq 404
        expect(json['code']).to eq 'lesson_class_not_found'
      end
    end

    context 'ユーザがクラス情報を変更した場合' do
      login_user
      let(:access_token){ user.access_token }
      let(:lesson_class_id){ LessonClass.last.id }
      it '403 Forbidden を返す' do
        subject

        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end

    context '体験ユーザがクラス情報を変更した場合' do
      login_trial_user
      let(:access_token){ trial_user.access_token }
      let(:lesson_class_id){ LessonClass.last.id }
      it '403 Forbidden を返す' do
        subject

        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end
  end

  describe 'GET /lesson_classes/:id' do
    subject { get "/api/v1/lesson_classes/#{lesson_classes_id}", headers: { Authorization: access_token }  }
    context '管理者が指定したクラス情報を取得した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json['lesson_rules'].last['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json['lesson_rules']).to eq []
        end
      end
    end

    context 'ユーザが存在しないクラス情報を取得した場合' do
      login_user
      let(:access_token){ user.access_token }
      let(:lesson_classes_id){ LessonClass.last.id + 1 }
      it '404 NotFound を返す' do
        subject

        expect(response.status).to eq 404
        expect(json['code']).to eq 'lesson_class_not_found'
      end
    end

    context 'ユーザが指定したクラス情報を取得した場合' do
      login_user
      let(:access_token){ user.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json['lesson_rules']['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json['lesson_rules']).to eq []
        end
      end
    end

    context '体験ユーザが指定したクラス情報を取得した場合' do
      login_trial_user
      let(:access_token){ trial_user.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '200 OK を返す' do
        subject

        expect(response.status).to eq 200
        last_lesson_class = LessonClass.last
        expect(json['id']).to eq last_lesson_class.id
        expect(json['name']).to eq last_lesson_class.name
        expect(json['location']).to eq last_lesson_class.location
        expect(json['description']).to eq last_lesson_class.description
        expect(json['color']).to eq last_lesson_class.color
        expect(json['price']).to eq last_lesson_class.price
        expect(json['for_children']).to eq last_lesson_class.for_children
        expect(json['user_limit_count']).to eq last_lesson_class.user_limit_count
        if last_lesson_class.lesson_rules.present?
          last_lesson_rule = last_lesson_class.lesson_rules.last
          expect(json['lesson_rules']['id']).to eq last_lesson_rule.id
          expect(Time.zone.parse(json['lesson_rules'].last['start_at'])).to eq last_lesson_rule.start_at
          expect(Time.zone.parse(json['lesson_rules'].last['end_at'])).to eq last_lesson_rule.end_at
        else
          expect(json['lesson_rules']).to eq []
        end
      end
    end
  end

  describe 'DELETE /lesson_classes/:id' do
    subject { delete "/api/v1/lesson_classes/#{lesson_classes_id}", headers: { Authorization: access_token }  }
    context '管理者が指定したクラスを削除した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '200 OK を返す' do
        expect{subject}.to change{LessonClass.count}.by(-1)
        expect(response.status).to eq 200
        expect(json['message']).to eq 'Lesson Class deleted.'
      end
    end

    context '管理者が存在しないクラスを削除した場合' do
      login_admin
      let(:access_token){ admin.access_token }
      let(:lesson_classes_id){ LessonClass.last.id + 1 }
      it '404 NotFound を返す' do
        expect{subject}.to change{LessonClass.count}.by(0)
        expect(response.status).to eq 404
        expect(json['code']).to eq 'lesson_class_not_found'
      end
    end

    context 'ユーザが指定したクラスを削除した場合' do
      login_user
      let(:access_token){ user.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '403 Forbidden を返す' do
        expect{subject}.to change{LessonClass.count}.by(0)
        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end

    context '体験ユーザが指定したクラスを削除した場合' do
      login_trial_user
      let(:access_token){ trial_user.access_token }
      let(:lesson_classes_id){ LessonClass.last.id }
      it '403 Forbidden を返す' do
        expect{subject}.to change{LessonClass.count}.by(0)
        expect(response.status).to eq 403
        expect(json['code']).to eq 'not_permitted'
      end
    end
  end
end
