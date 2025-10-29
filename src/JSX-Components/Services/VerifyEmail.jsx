import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserService from "../UserService";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    if (token) {
      UserService.verifyEmail(token)
        .then((res) => setMessage("✅ Your account has been verified! You can now log in."))
        .catch((err) => setMessage(`❌ Verification failed: ${err}`));
    } else {
      setMessage("❌ No token provided.");
    }
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;