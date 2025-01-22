import AdminSignin from "@/components/Auth/AdminLogin";
import AdminSignup from "@/components/Auth/AdminSignUp";
import Login from "@/components/Auth/UserSignIn";
import Signup from "@/components/Auth/UserSignUp";

const AuthPage = async ({ params }) => {
  const { authType } = await params;

  const renderAuthType = (authType) => {
    switch (authType) {
      case "signin":
        return <Login />;
      case "signup":
        return <Signup />;
      case "adminSignin":
        return <AdminSignin />;
      case "adminSignup":
        return <AdminSignup />;
      default:
        "Invalid auth type.";
    }
  };
  return (
    <main className="min-h-screen">
      {/* <p>Auth Page</p> */}
      {renderAuthType(authType)}
    </main>
  );
};

export default AuthPage;
