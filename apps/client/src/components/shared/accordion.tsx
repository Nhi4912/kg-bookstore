import { ChevronDown } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

/* ─── Context ─── */
interface AccordionCtx {
	open: boolean;
	toggle: () => void;
	contentId: string;
	triggerId: string;
}

const Ctx = createContext<AccordionCtx>({
	open: false,
	toggle: () => {},
	contentId: "",
	triggerId: "",
});

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
	const id = useId();
	const contentId = `accordion-content-${id}`;
	const triggerId = `accordion-trigger-${id}`;

	return (
		<Ctx.Provider value={{ open, toggle, contentId, triggerId }}>
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
	const { open, toggle, contentId, triggerId } = useContext(Ctx);

	return (
		<button
			id={triggerId}
			type="button"
			onClick={toggle}
			aria-expanded={open}
			aria-controls={contentId}
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
	const { open, contentId, triggerId } = useContext(Ctx);
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.scrollHeight);
		}
	}, [children, open]);

	return (
		<div
			id={contentId}
			role="region"
			aria-labelledby={triggerId}
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
