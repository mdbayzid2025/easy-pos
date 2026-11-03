import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { handleApiError } from "../../utils/handleApiError";
import { useLoginAdminMutation } from "../../redux/features/auth/authApi";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [login] = useLoginAdminMutation();

  useEffect(() => {
    const savedUsername = Cookies.get("username") || Cookies.get("email");
    const savedPassword = Cookies.get("password");
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setAcceptTerms(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (acceptTerms) {
      Cookies.set("username", username);
      Cookies.set("password", password);
    } else {
      Cookies.remove("username");
      Cookies.remove("password");
    }
    try {
      const response = await login({ username, password }).unwrap();

      console.log(response);
      if (response?.success) {
        toast.success(response?.message);
        Cookies.set("accessToken", response?.token);
        Cookies.set("role", response?.data?.role);
        window.location.replace("/");
      } else {
        handleApiError(response);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#f7f8fc] to-[#eef2ff] px-4">
      <Card
        className="w-full max-w-md rounded-2xl shadow-lg"
        data-aos="zoom-in"
      >
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/logo2.png"
              className="w-full  max-w-30 h-14 object-cover overflow-visible scale-70"
              alt="Logo"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Welcome To <span className="text-primary "> Ainal Properties</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-1">
              <Label className="mb-2">Username</Label>
              <Input
                type="text"
                placeholder="enter username..."
                className="h-11"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="mb-2">Password</Label>

              <div className="relative">
                <Input
                  type={viewPassword ? "text" : "password"}
                  placeholder="enter password..."
                  className="h-11 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setViewPassword(!viewPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent!"
                >
                  {viewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* Terms + Forgot */}
            <div className="space-y-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600
    "
                                /> */}
                <input
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  type="checkbox"
                  id="terms"
                  name="terms"
                  value="Bike"
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  Remember Me
                </Label>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full h-11 text-base">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
