import { ChevronDown } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

/* ─── Context ─── */
interface AccordionCtx {
	open: boolean;
	toggle: () => void;
}

const Ctx = createContext<AccordionCtx>({ open: false, toggle: () => {} });

/* ─── Root ─── */
const Accordion = ({
	defaultOpen = false,
	children,
	className = "",
}: {
	defaultOpen?: boolean;
	children: React.ReactNode;
	className?: string;
}) => {
	const [open, setOpen] = useState(defaultOpen);
	const toggle = useCallback(() => setOpen((o) => !o), []);

	return (
		<Ctx.Provider value={{ open, toggle }}>
			<div className={className}>{children}</div>
		</Ctx.Provider>
	);
};

/* ─── Trigger ─── */
const AccordionTrigger = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const { open, toggle } = useContext(Ctx);

	return (
		<button
			type="button"
			onClick={toggle}
			aria-expanded={open}
			className={`flex w-full items-center justify-between ${className}`}
		>
			{children}
			<ChevronDown
				size={18}
				className={`shrink-0 transition-transform duration-250 ${open ? "rotate-180" : ""}`}
			/>
		</button>
	);
};

/* ─── Content ─── */
const AccordionContent = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const { open } = useContext(Ctx);
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.scrollHeight);
		}
	}, [children, open]);

	return (
		<div
			className="overflow-hidden transition-[height] duration-250 ease-in-out"
			style={{ height: open ? height : 0 }}
		>
			<div ref={ref} className={className}>
				{children}
			</div>
		</div>
	);
};

Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export default Accordion;
