import { zodResolver } from "@hookform/resolvers/zod";
import type { SignUpRequest } from "@kgbookstore/api-contract";
import { signUpRequestSchema } from "@kgbookstore/api-contract";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthSection from "@/components/shared/auth-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants";
import { useSignUp } from "@/hooks/use-auth";

const SignupPage = () => {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = useSignUp();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpRequest>({
		resolver: zodResolver(signUpRequestSchema),
	});

	const onSubmit = async (values: SignUpRequest) => {
		try {
			await mutateAsync(values);
			toast.success("Đăng kí thành công!");
			navigate(ROUTES.LOGIN);
		} catch {
			toast.error("Đăng kí thất bại. Vui lòng thử lại.");
		}
	};

	return (
		<AuthSection
			title="Đăng kí"
			footerText="Đã có tài khoản?"
			footerLinkText="Đăng nhập"
			footerLinkTo={ROUTES.LOGIN}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Tên</Label>
					<Input id="name" {...register("name")} />
					{errors.name && (
						<p className="text-sm text-destructive">{errors.name.message}</p>
					)}
				</div>

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

				<div className="space-y-2">
					<Label htmlFor="confirm_password">Nhập lại mật khẩu</Label>
					<Input
						id="confirm_password"
						type="password"
						{...register("confirm_password")}
					/>
					{errors.confirm_password && (
						<p className="text-sm text-destructive">
							{errors.confirm_password.message}
						</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? "Đang xử lý..." : "Đăng kí"}
				</Button>
			</form>
		</AuthSection>
	);
};

export default SignupPage;
