import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── InputHF ───

interface InputHFProps {
	name: string;
	label: string;
	placeholder?: string;
	type?: string;
	required?: boolean;
}

const InputHF = ({
	name,
	label,
	placeholder,
	type = "text",
	required = false,
}: InputHFProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const error = errors[name];

	return (
		<div className="space-y-1.5">
			<Label htmlFor={name}>
				{label}
				{required && <span className="text-destructive"> *</span>}
			</Label>
			<Input
				id={name}
				type={type}
				placeholder={placeholder}
				{...register(name)}
			/>
			{error && (
				<p className="text-xs text-destructive">{error.message as string}</p>
			)}
		</div>
	);
};

// ─── TextareaHF ───

interface TextareaHFProps {
	name: string;
	label: string;
	placeholder?: string;
	rows?: number;
}

const TextareaHF = ({
	name,
	label,
	placeholder,
	rows = 3,
}: TextareaHFProps) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	const error = errors[name];

	return (
		<div className="space-y-1.5">
			<Label htmlFor={name}>{label}</Label>
			<Textarea
				id={name}
				placeholder={placeholder}
				rows={rows}
				{...register(name)}
			/>
			{error && (
				<p className="text-xs text-destructive">{error.message as string}</p>
			)}
		</div>
	);
};

// ─── CheckboxHF ───

interface CheckboxHFProps {
	name: string;
	label: string;
}

const CheckboxHF = ({ name, label }: CheckboxHFProps) => {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<div className="flex items-center gap-2">
					<Checkbox
						id={name}
						checked={field.value ?? false}
						onCheckedChange={field.onChange}
					/>
					<Label htmlFor={name} className="cursor-pointer">
						{label}
					</Label>
				</div>
			)}
		/>
	);
};

// ─── SelectHF ───

interface SelectHFOption {
	value: string;
	label: string;
}

interface SelectHFProps {
	name: string;
	label: string;
	placeholder?: string;
	options: SelectHFOption[];
	required?: boolean;
}

const SelectHF = ({
	name,
	label,
	placeholder = "Chọn...",
	options,
	required = false,
}: SelectHFProps) => {
	const {
		control,
		formState: { errors },
	} = useFormContext();
	const error = errors[name];

	return (
		<div className="space-y-1.5">
			<Label htmlFor={name}>
				{label}
				{required && <span className="text-destructive"> *</span>}
			</Label>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Select
						value={field.value ?? ""}
						onValueChange={(val) => field.onChange(val)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>
			{error && (
				<p className="text-xs text-destructive">{error.message as string}</p>
			)}
		</div>
	);
};

// ─── FormSection ───

interface FormSectionProps {
	title: string;
	children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
	return (
		<div className="space-y-4 rounded-lg border bg-card p-6">
			<h3 className="text-base font-semibold">{title}</h3>
			{children}
		</div>
	);
};

export { CheckboxHF, FormSection, InputHF, SelectHF, TextareaHF };
