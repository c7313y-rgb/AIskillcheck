import { useMemo } from "react";
import { ADULT_COURSES, EDUCATION_COURSES } from "../data/courses";
import { HOME_PREVIEW_IDS } from "../data/packages";
import { CourseVisual } from "./CourseVisual";
import { useDiagnosis } from "../context/useDiagnosis";

export function CoursePreview() {
  const { state, dispatch } = useDiagnosis();
  const audience = state.previewAudience;

  const courses = useMemo(() => {
    const source = audience === "student" ? EDUCATION_COURSES : ADULT_COURSES;
    const ids = HOME_PREVIEW_IDS[audience] ?? [];
    return ids.map((id) => source.find((course) => course.id === id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [audience]);

  return (
    <article className="premium-card course-preview" aria-labelledby="course-preview-heading">
      <div className="card-head">
        <h2 id="course-preview-heading">あなたにおすすめの講座</h2>
        <a href="#courses">すべて見る</a>
      </div>
      <div className="preview-tabs" role="tablist" aria-label="おすすめ講座の対象切り替え">
        <button
          type="button"
          role="tab"
          className={`preview-tab${audience === "student" ? " active" : ""}`}
          aria-selected={audience === "student"}
          aria-pressed={audience === "student"}
          onClick={() => dispatch({ type: "SET_PREVIEW_AUDIENCE", audience: "student" })}
        >
          学生・生徒向け
          <br />
          <small>AI講座 for education</small>
        </button>
        <button
          type="button"
          role="tab"
          className={`preview-tab${audience === "adult" ? " active" : ""}`}
          aria-selected={audience === "adult"}
          aria-pressed={audience === "adult"}
          onClick={() => dispatch({ type: "SET_PREVIEW_AUDIENCE", audience: "adult" })}
        >
          社会人・企業向け
          <br />
          <small>企業向けAI講座</small>
        </button>
      </div>
      <div className="preview-courses">
        {courses.map((course, index) => (
          <article key={course.id}>
            <CourseVisual item={course} variant="preview" />
            {index === 0 && <span className="preview-badge">おすすめ</span>}
            <div className="preview-course-body">
              <span className="tag">{course.tag}</span>
              <h3>{course.title}</h3>
              <p>{course.note}</p>
              <div className="preview-course-meta">
                <span>{course.mode}</span>
                <span>{course.hours}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}
