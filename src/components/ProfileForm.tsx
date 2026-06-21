import { useDiagnosis } from "../context/useDiagnosis";
import type { UserType } from "../data/types";

const ROLE_OPTIONS = [
  "経営・事業責任者",
  "管理職・PM",
  "営業・企画",
  "管理・バックオフィス",
  "開発・IT",
  "教員・教育関係者",
  "高校生",
  "大学生・専門学生",
  "その他",
];

export function ProfileForm() {
  const { state, dispatch } = useDiagnosis();
  const { form } = state;

  function setUserType(userType: UserType) {
    dispatch({ type: "SET_USER_TYPE", userType });
  }

  return (
    <section className="form-panel profile-panel" aria-labelledby="profile-heading">
      <h3 id="profile-heading">1. 基本情報入力</h3>
      <div className="type-toggle" role="radiogroup" aria-label="利用者タイプ">
        <label>
          <input
            type="radio"
            name="userType"
            value="adult"
            checked={form.userType === "adult"}
            onChange={() => setUserType("adult")}
          />
          <span>社会人</span>
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="student"
            checked={form.userType === "student"}
            onChange={() => setUserType("student")}
          />
          <span>生徒・学生</span>
        </label>
      </div>
      <div className="field-grid">
        <label htmlFor="personName">
          お名前またはニックネーム
          <input
            id="personName"
            name="personName"
            type="text"
            placeholder="例：山田 太郎"
            value={form.personName}
            onChange={(event) => dispatch({ type: "SET_FIELD", field: "personName", value: event.target.value })}
          />
        </label>
        <label htmlFor="organization">
          所属・学校・会社
          <input
            id="organization"
            name="organization"
            type="text"
            placeholder="例：営業企画部 / 高校2年"
            value={form.organization}
            onChange={(event) => dispatch({ type: "SET_FIELD", field: "organization", value: event.target.value })}
          />
        </label>
        <label htmlFor="currentRole">
          現在の立場
          <select
            id="currentRole"
            name="currentRole"
            value={form.currentRole}
            onChange={(event) => dispatch({ type: "SET_FIELD", field: "currentRole", value: event.target.value })}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="baseIncome">
          参考：現在の年収・報酬額
          <input
            id="baseIncome"
            name="baseIncome"
            type="number"
            min={0}
            step={10}
            placeholder="例：520（万円）"
            value={form.baseIncome}
            onChange={(event) => dispatch({ type: "SET_FIELD", field: "baseIncome", value: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
