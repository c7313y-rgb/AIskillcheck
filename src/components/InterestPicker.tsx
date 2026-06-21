import { INTERESTS } from "../data/interests";
import { useDiagnosis } from "../context/useDiagnosis";

export function InterestPicker() {
  const { state, dispatch } = useDiagnosis();
  const selected = new Set(state.form.interests);

  return (
    <section className="form-panel interest-panel" aria-labelledby="interest-heading">
      <h3 id="interest-heading">2. 活かしたいこと</h3>
      <p className="hint" id="interest-hint">
        複数選択できます。選択内容に応じて、目標レベルと推奨講座が変わります。
      </p>
      <div className="chip-grid" role="group" aria-labelledby="interest-heading" aria-describedby="interest-hint">
        {INTERESTS.map((interest) => (
          <label className="interest-chip" key={interest.key}>
            <input
              type="checkbox"
              name="interests"
              value={interest.key}
              checked={selected.has(interest.key)}
              onChange={() => dispatch({ type: "TOGGLE_INTEREST", interest: interest.key })}
            />
            <span>
              {interest.icon} {interest.label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
