import React from "react";

const Icon = ({ size = 40, children }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		{children}
	</svg>
);

export const MapIcon = (props) => (
	<Icon {...props}>
		<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
		<path d="M15 5.764v15" />
		<path d="M9 3.236v15" />
	</Icon>
);

export const MapPinIcon = (props) => (
	<Icon {...props}>
		<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
		<circle cx="12" cy="10" r="3" />
	</Icon>
);

export const RouteIcon = (props) => (
	<Icon {...props}>
		<circle cx="6" cy="19" r="3" />
		<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
		<circle cx="18" cy="5" r="3" />
	</Icon>
);

export const GlobeIcon = (props) => (
	<Icon {...props}>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
		<path d="M2 12h20" />
	</Icon>
);

export const CameraIcon = (props) => (
	<Icon {...props}>
		<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
		<circle cx="12" cy="13" r="3" />
	</Icon>
);

export const ImageIcon = (props) => (
	<Icon {...props}>
		<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
		<circle cx="9" cy="9" r="2" />
		<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
	</Icon>
);

export const PlaneIcon = (props) => (
	<Icon {...props}>
		<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
	</Icon>
);

export const CalendarIcon = (props) => (
	<Icon {...props}>
		<path d="M8 2v4" />
		<path d="M16 2v4" />
		<rect width="18" height="18" x="3" y="4" rx="2" />
		<path d="M3 10h18" />
	</Icon>
);

export const LockIcon = (props) => (
	<Icon {...props}>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</Icon>
);

export const UnlockIcon = (props) => (
	<Icon {...props}>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 9.9-1" />
	</Icon>
);

export const KeyIcon = (props) => (
	<Icon {...props}>
		<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
		<path d="m21 2-9.6 9.6" />
		<circle cx="7.5" cy="15.5" r="5.5" />
	</Icon>
);

export const SettingsIcon = (props) => (
	<Icon {...props}>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</Icon>
);

export const RefreshIcon = (props) => (
	<Icon {...props}>
		<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
		<path d="M8 16H3v5" />
	</Icon>
);

export const SmartphoneIcon = (props) => (
	<Icon {...props}>
		<rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
		<path d="M12 18h.01" />
	</Icon>
);

export const PhoneIcon = (props) => (
	<Icon {...props}>
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
	</Icon>
);

export const HomeIcon = (props) => (
	<Icon {...props}>
		<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<polyline points="9 22 9 12 15 12 15 22" />
	</Icon>
);

export const FileTextIcon = (props) => (
	<Icon {...props}>
		<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		<path d="M10 9H8" />
		<path d="M16 13H8" />
		<path d="M16 17H8" />
	</Icon>
);

export const ClipboardListIcon = (props) => (
	<Icon {...props}>
		<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
		<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		<path d="M12 11h4" />
		<path d="M12 16h4" />
		<path d="M8 11h.01" />
		<path d="M8 16h.01" />
	</Icon>
);

export const PencilIcon = (props) => (
	<Icon {...props}>
		<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
		<path d="m15 5 4 4" />
	</Icon>
);

export const PlusIcon = (props) => (
	<Icon {...props}>
		<path d="M5 12h14" />
		<path d="M12 5v14" />
	</Icon>
);

export const TargetIcon = (props) => (
	<Icon {...props}>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="12" r="6" />
		<circle cx="12" cy="12" r="2" />
	</Icon>
);

export const SaveIcon = (props) => (
	<Icon {...props}>
		<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
		<polyline points="17 21 17 13 7 13 7 21" />
		<polyline points="7 3 7 8 15 8" />
	</Icon>
);

export const BotIcon = (props) => (
	<Icon {...props}>
		<path d="M12 8V4H8" />
		<rect width="16" height="12" x="4" y="8" rx="2" />
		<path d="M2 14h2" />
		<path d="M20 14h2" />
		<path d="M15 13v2" />
		<path d="M9 13v2" />
	</Icon>
);

export const BarChartIcon = (props) => (
	<Icon {...props}>
		<path d="M3 3v18h18" />
		<path d="M7 16v-4" />
		<path d="M11 16v-8" />
		<path d="M15 16v-6" />
		<path d="M19 16v-2" />
	</Icon>
);

export const MailIcon = (props) => (
	<Icon {...props}>
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
	</Icon>
);

export const LinkIcon = (props) => (
	<Icon {...props}>
		<path d="M9 17H7A5 5 0 0 1 7 7h2" />
		<path d="M15 7h2a5 5 0 1 1 0 10h-2" />
		<line x1="8" x2="16" y1="12" y2="12" />
	</Icon>
);

export const SearchIcon = (props) => (
	<Icon {...props}>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</Icon>
);

export const DumbbellIcon = (props) => (
	<Icon {...props}>
		<path d="M14.4 14.4 9.6 9.6" />
		<path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
		<path d="m21.5 21.5-1.4-1.4" />
		<path d="M3.9 3.9 2.5 2.5" />
		<path d="M6.343 2.515a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829l-6.364 6.364a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829z" />
	</Icon>
);

export const PartyIcon = (props) => (
	<Icon {...props}>
		<path d="M5.8 11.3 2 22l10.7-3.79" />
		<path d="M4 3h.01" />
		<path d="M22 8h.01" />
		<path d="M15 2h.01" />
		<path d="M22 20h.01" />
		<path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
		<path d="m22 13-1.99-.94c-.7-.31-1.32.86-1.32 1.62v.07c0 .81-.58 1.55-1.39 1.81l-.36.11" />
		<path d="m17 22 3-2 1 1" />
		<path d="m22 17.4-1.49-1.49a2 2 0 0 0-2.83 0L14 19.59" />
	</Icon>
);

export const PackageIcon = (props) => (
	<Icon {...props}>
		<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
		<path d="M12 22V12" />
		<path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
		<path d="m7.5 4.27 9 5.15" />
	</Icon>
);

export const FolderIcon = (props) => (
	<Icon {...props}>
		<path d="M6 14a2 2 0 0 0-2 2" />
		<path d="M20 20a2 2 0 0 0 2-2" />
		<path d="M20 20H6" />
		<path d="M6 14h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2" />
		<path d="M6 14V6a2 2 0 0 1 2-2h3.143a2 2 0 0 1 1.595.79l1.044 1.38a2 2 0 0 0 1.605.83H18a2 2 0 0 1 2 2" />
	</Icon>
);

export const HourglassIcon = (props) => (
	<Icon {...props}>
		<path d="M5 22h14" />
		<path d="M5 2h14" />
		<path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
		<path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
	</Icon>
);

export const CheckIcon = (props) => (
	<Icon {...props}>
		<path d="M21.801 10A10 10 0 1 1 17 3.335" />
		<path d="m9 11 3 3L22 4" />
	</Icon>
);

export const UploadIcon = (props) => (
	<Icon {...props}>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="17 8 12 3 7 8" />
		<line x1="12" x2="12" y1="3" y2="15" />
	</Icon>
);

export const TimerIcon = (props) => (
	<Icon {...props}>
		<line x1="10" x2="14" y1="2" y2="2" />
		<line x1="12" x2="15" y1="14" y2="11" />
		<circle cx="12" cy="14" r="8" />
	</Icon>
);

export const RocketIcon = (props) => (
	<Icon {...props}>
		<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
		<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
		<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
		<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
	</Icon>
);

export const SparklesIcon = (props) => (
	<Icon {...props}>
		<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
		<path d="M20 3v4" />
		<path d="M22 5h-4" />
		<path d="M4 17v2" />
		<path d="M5 18H3" />
	</Icon>
);

export const ActivityIcon = (props) => (
	<Icon {...props}>
		<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.68 3.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4.45 13H2" />
	</Icon>
);

export const MusicIcon = (props) => (
	<Icon {...props}>
		<path d="M9 18V5l12-2v13" />
		<circle cx="6" cy="18" r="3" />
		<circle cx="18" cy="16" r="3" />
	</Icon>
);

export const CloudIcon = (props) => (
	<Icon {...props}>
		<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9z" />
	</Icon>
);

export const BookOpenIcon = (props) => (
	<Icon {...props}>
		<path d="M12 7v14" />
		<path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
	</Icon>
);

export const HandIcon = (props) => (
	<Icon {...props}>
		<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
		<path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
		<path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
		<path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
	</Icon>
);
