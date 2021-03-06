import * as React from 'react';
import { AuthContext } from 'Auth';
import { 
  MyProfileCard,
  ItemGrid,
  PasswordResetButton,
} from 'components';
import {
  AccountCircle,
  LocalAtm,
  LockOutlined,
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import * as moment from 'moment';

const ProfileView: React.FC = () => {
  const { currentUser } = React.useContext(AuthContext);

  return (
    <div>
      { currentUser ? (
        <div>
          <Grid container>
            <ItemGrid xs={12} md={6} lg={6}>
              <MyProfileCard
                headerColor="orange"
                cardTitle="マイプロフィール"
                icon={AccountCircle}
                tableData={[
                  ["名前", currentUser.last_name + " " + currentUser.first_name],
                  ["名前（カナ）", currentUser.last_name_kana + " " + currentUser.first_name_kana],
                  ["電話番号", currentUser.phone_number],
                  ["メールアドレス", currentUser.email],
                  ["年齢", currentUser.age + " 歳"],
                  ["生年月日", moment(currentUser.birthday).format("LL")],
                ]}
              />
            </ItemGrid>
            <ItemGrid xs={12} md={6} lg={4}>
              <MyProfileCard
                headerColor="orange"
                cardTitle="マイコース"
                icon={LocalAtm}
                tableData={
                  currentUser.plans.map((plan) => [
                    plan.name,
                    plan.price == 0 ?  "" : `${plan.price.toLocaleString()} 円`
                  ])
                }
              />
            </ItemGrid>
          </Grid>
          <Grid container>
            <ItemGrid xs={12} md={6} lg={4}>
              <MyProfileCard
                headerColor="orange"
                cardTitle="ログイン設定"
                icon={LockOutlined}
                tableData={[
                  ["パスワード", <PasswordResetButton email={currentUser.email}/>],
                ]}
              />
            </ItemGrid>
          </Grid>
        </div>
      ) : (
        <p>予期せぬエラーが発生しました。時間をおいて再度お試しください。</p>
      )
      }
    </div>
  );
};

export default ProfileView;