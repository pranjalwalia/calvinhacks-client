import { useContext } from "react";
import { authContext } from "../contexts/auth";

export const SignUp = () => {
  const { auth, setAuth } = useContext(authContext);

  const validateForm = () => {};

  const onSubmit = () => {
    if (validateForm) {
      setAuth(true);
    }
  };

  return (
    <div>
      <h1>The SignUp Container</h1>
    </div>
  );
};
