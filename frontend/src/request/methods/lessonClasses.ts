import { fetchApp } from 'request/fetcher';
import { LessonClass } from 'responses/responseStructs';
import { CreateLessonClassRequest } from 'request/requestStructs';
import { MomentLessonRule, convertMomentLessonRulesToRequest } from 'assets/lib/lessonRules';
import { getAccessToken, checkErrors } from 'request/methods/common';

// GET /v1/lesson_classes
export const getLessonClasses = async (): Promise<LessonClass[] | undefined> => {
  const accessToken = getAccessToken();
  if (!accessToken) return;

  const res = await fetchApp(
    '/v1/lesson_classes',
    'GET',
    accessToken,
  )

  const response = checkErrors(res);
  if (!response) return;

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    return;
  }
};

// POST /v1/lesson_classes
export const createLessonClass = async (lessonClass: CreateLessonClassRequest | LessonClass, momentLessonRules: MomentLessonRule[], snackBar: Function, updateFunc?: Function) => {
  const accessToken = getAccessToken();
  if (!accessToken) return;

  // NOTE: JSON.stringify で key になるため lesson_class という名前になっている
  const lesson_class = {
    name: lessonClass.name,
    location: lessonClass.location,
    description: lessonClass.description,
    price: lessonClass.price,
    color: lessonClass.color,
    for_children: lessonClass.for_children,
    lesson_rules: convertMomentLessonRulesToRequest(momentLessonRules),
    user_limit_count: lessonClass.user_limit_count,
  };

  const res = await fetchApp(
    '/v1/lesson_classes',
    'POST',
    accessToken,
    JSON.stringify({
      lesson_class,
    })
  )

  const response = checkErrors(res, snackBar);
  if (!response) return;

  const json = await response.json();
  switch (response.status) {
    case 201:
      snackBar('クラスの作成に成功しました。', { variant: 'success'});
      if (updateFunc) updateFunc();
      break;
    case 422:
      switch (json.code) {
        case 'lesson_rule_invalid_error':
          snackBar('スケジュールの作成に失敗したためクラスの作成に失敗しました。', { variant: 'error' });
          break;
        default:
          snackBar('クラスの作成に失敗しました。内容を確かめてください。', { variant: 'error' });
      };
      break;
    default:
      snackBar('クラスの作成に失敗しました。', { variant: 'error' });
  }
};

// PATCH /v1/lesson_classes/:id
export const updateLessonClass = async (lessonClass: CreateLessonClassRequest | LessonClass, momentLessonRules: MomentLessonRule[], snackBar: Function, lessonClassID?: number, updateFunc?: Function) => {
  const accessToken = getAccessToken();
  if (!accessToken) return;
  if (!lessonClassID) return;

  // NOTE: JSON.stringify で key になるため lesson_class という名前になっている
  const lesson_class = {
    name: lessonClass.name,
    location: lessonClass.location,
    description: lessonClass.description,
    price: lessonClass.price,
    color: lessonClass.color,
    for_children: lessonClass.for_children,
    lesson_rules: convertMomentLessonRulesToRequest(momentLessonRules),
    user_limit_count: lessonClass.user_limit_count,
  };

  const res = await fetchApp(
    `/v1/lesson_classes/${lessonClassID}`,
    'PATCH',
    accessToken,
    JSON.stringify({
      lesson_class,
    })
  )

  const response = checkErrors(res, snackBar);
  if (!response) return;

  const json = await response.json();
  switch (response.status) {
    case 200:
      snackBar('クラス情報の変更に成功しました。', { variant: 'success'});
      if (updateFunc) updateFunc();
      break;
    case 404:
      snackBar(`ID:${lessonClassID}のクラスが存在しないため変更に失敗しました。`, { variant: 'error' });
      break;
    case 422:
      switch (json.code) {
        case 'lesson_rule_invalid_error':
          snackBar('スケジュールの作成に失敗したためクラス情報の変更に失敗しました。', { variant: 'error' });
          break;
        default:
          snackBar('クラス情報の変更に失敗しました。内容を確かめてください。', { variant: 'error' });
      };
      break;
    default:
      snackBar('クラス情報の変更に失敗しました。', { variant: 'error' });
  }
};