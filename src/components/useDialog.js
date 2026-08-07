import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

export default function useDialog(isOpen, onClose) {
	const dialogRef = useRef(null);
	const returnFocusRef = useRef(null);

	const focusables = useCallback(() => {
		const root = dialogRef.current;
		if (!root) return [];
		return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
			(el) => el.offsetWidth > 0 || el.offsetHeight > 0,
		);
	}, []);

	useEffect(() => {
		if (!isOpen) return undefined;

		returnFocusRef.current = document.activeElement;
		document.body.style.overflow = "hidden";

		const first = focusables()[0] || dialogRef.current;
		first?.focus();

		const onKeyDown = (event) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				onClose();
				return;
			}
			if (event.key !== "Tab") return;

			const items = focusables();
			if (items.length === 0) {
				event.preventDefault();
				return;
			}
			const edge = event.shiftKey ? items[0] : items[items.length - 1];
			if (document.activeElement === edge) {
				event.preventDefault();
				(event.shiftKey ? items[items.length - 1] : items[0]).focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
			returnFocusRef.current?.focus?.();
		};
	}, [isOpen, onClose, focusables]);

	return dialogRef;
}
