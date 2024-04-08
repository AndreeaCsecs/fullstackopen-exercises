import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ course }) => {
  const totalExercises = course.map((c) =>
    c.parts.reduce((sum, part) => sum + part.exercises, 0)
  );

  return (
    <div>
      {course.map((c, index) => (
        <div key={c.id}>
          <Header course={c.name} />
          <Content parts={c.parts} />
          <Total sum={totalExercises[index]} />
        </div>
      ))}
    </div>
  );
};

export default Course;
