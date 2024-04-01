//Total.jsx

const Total = (props) => {
  console.log("before", props);
  const { course } = props;
  console.log("after", props);

  return (
    <>
      <p>
        Number of exercises{" "}
        {course.parts[0].exercises +
          course.parts[1].exercises +
          course.parts[2].exercises}
      </p>
    </>
  );
};

export default Total;
