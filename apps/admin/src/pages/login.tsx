import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInRequest } from "@kgbookstore/api-contract";
import { signInRequestSchema } from "@kgbookstore/api-contract";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthSection from "@/components/shared/auth-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";
import { useAuth, useSignIn } from "@/hooks/use-auth";

const LoginPage = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const { mutateAsync, isPending } = useSignIn();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInRequest>({
		resolver: zodResolver(signInRequestSchema),
	});

	const onSubmit = async (values: SignInRequest) => {
		try {
			const data = await mutateAsync(values);
			auth.login(data);
			navigate(ROUTES.PRODUCTS);
		} catch {
			toast.error("Email hoặc mật khẩu không chính xác");
		}
	};

	return (
		<AuthSection
			title="Đăng nhập"
			footerText="Chưa có tài khoản?"
			footerLinkText="Đăng kí"
			footerLinkTo={ROUTES.SIGNUP}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" {...register("email")} />
					{errors.email && (
						<p className="text-sm text-destructive">{errors.email.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Mật khẩu</Label>
					<Input id="password" type="password" {...register("password")} />
					{errors.password && (
						<p className="text-sm text-destructive">
							{errors.password.message}
						</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? "Đang xử lý..." : "Đăng nhập"}
				</Button>
			</form>
		</AuthSection>
	);
};

export default LoginPage;
