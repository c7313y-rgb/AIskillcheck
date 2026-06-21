import { CourseVisual } from "./CourseVisual";
import type { DiagnosisResult } from "../lib/diagnosis";

interface CourseRecommendationsProps {
  result: DiagnosisResult;
}

export function CourseRecommendations({ result }: CourseRecommendationsProps) {
  const isStudent = result.profile.userType === "student";
  const audienceLabel = isStudent ? "AI講座 for educationから提案" : "企業向け実践AI講座から提案";
  const pkg = result.courses.packageRec;

  return (
    <article id="courses" className="large-card course-section-card premium-card" aria-labelledby="course-rec-heading">
      <div className="card-title">
        <h3 id="course-rec-heading">あなたに合う講座</h3>
        <small>{audienceLabel}</small>
      </div>
      <div className="course-grid">
        {result.courses.top.map((course) => (
          <article className="course-card" key={course.id}>
            <CourseVisual item={course} />
            <div className="course-body">
              <span className="tag">{course.tag}</span>
              <h4>{course.title}</h4>
              <p>{course.note}</p>
              <div className="course-reasons">
                {course.reasons.map((reason) => (
                  <span key={reason}>{reason}</span>
                ))}
              </div>
              <div className="course-meta">
                <span>{course.mode}</span>
                <span>{course.hours}</span>
                <span>{course.price}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!isStudent && pkg && (
        <div className="package-card active">
          <CourseVisual item={pkg} variant="package" />
          <div>
            <b>組み合わせプラン例</b>
            <h4>{pkg.title}</h4>
            <p>{pkg.target}</p>
            <div className="course-meta">
              <span>{pkg.hours}</span>
              <span>{pkg.price}</span>
              <span>{pkg.courses.length}講座を束ねた提案</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
