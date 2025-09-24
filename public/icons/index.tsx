export const ArrowLeftIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <path
      d="M31.6667 20.0001L8.33341 20.0001M8.33341 20.0001L20.0001 31.6667M8.33341 20.0001L20.0001 8.33341"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronLeftIcon = ({
  size = "size",
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M20 24L12 16L20 8"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRightIcon = ({
  size = "size",
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M12 24L20 16L12 8"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserLargeIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="67"
    height="68"
    viewBox="0 0 67 68"
    fill="none"
  >
    <path
      d="M56.0532 56.6667V51.1597C56.0532 48.2387 54.8928 45.4372 52.8273 43.3717C50.7617 41.3062 47.9603 40.1458 45.0392 40.1458H23.0112C20.0901 40.1458 17.2886 41.3062 15.2231 43.3717C13.1576 45.4372 11.9972 48.2387 11.9972 51.1597V56.6667"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34.0251 31.8854C40.108 31.8854 45.0391 26.9543 45.0391 20.8714C45.0391 14.7886 40.108 9.85742 34.0251 9.85742C27.9422 9.85742 23.0111 14.7886 23.0111 20.8714C23.0111 26.9543 27.9422 31.8854 34.0251 31.8854Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <path
      d="M7.5 9.75L14 16.25L20.5 9.75"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronUpIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="8"
    viewBox="0 0 16 8"
    fill="none"
  >
    <path
      d="M1.5 7.25L8 0.750001L14.5 7.25"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BookmarkIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <rect width="32" height="32" rx="16" fill="white" fillOpacity="0.15" />
    <path
      d="M22.8571 24L16 19.5556L9.14282 24V9.77778C9.14282 9.30628 9.34924 8.8541 9.71665 8.5207C10.0841 8.1873 10.5824 8 11.102 8H20.8979C21.4175 8 21.9159 8.1873 22.2833 8.5207C22.6507 8.8541 22.8571 9.30628 22.8571 9.77778V24Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BookmarkFilledIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M22.8571 24L16 19.5556L9.14282 24V9.77778C9.14282 9.30628 9.34924 8.8541 9.71665 8.5207C10.0841 8.1873 10.5824 8 11.102 8H20.8979C21.4175 8 21.9159 8.1873 22.2833 8.5207C22.6507 8.8541 22.8571 9.30628 22.8571 9.77778V24Z"
      fill={currentColor}
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartIcon = ({ size = "size", currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M22.7663 10.3261C22.3753 9.90569 21.9111 9.57219 21.4002 9.34465C20.8893 9.11711 20.3417 9 19.7887 9C19.2357 9 18.6881 9.11711 18.1772 9.34465C17.6663 9.57219 17.2021 9.90569 16.8112 10.3261L15.9998 11.1982L15.1884 10.3261C14.3987 9.4773 13.3277 9.00044 12.2109 9.00044C11.0941 9.00044 10.023 9.4773 9.23334 10.3261C8.44365 11.1749 8 12.3262 8 13.5266C8 14.727 8.44365 15.8782 9.23334 16.727L10.0447 17.5991L15.9998 24L21.9549 17.5991L22.7663 16.727C23.1574 16.3068 23.4677 15.8079 23.6794 15.2587C23.891 14.7096 24 14.121 24 13.5266C24 12.9321 23.891 12.3435 23.6794 11.7944C23.4677 11.2453 23.1574 10.7463 22.7663 10.3261Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartFilledIcon = ({
  size = "size",
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
  >
    <rect width="32" height="32" rx="16" fill="white" fillOpacity="0.4" />
    <path
      d="M22.7663 10.3261C22.3753 9.90569 21.9111 9.57219 21.4002 9.34465C20.8893 9.11711 20.3417 9 19.7887 9C19.2357 9 18.6881 9.11711 18.1772 9.34465C17.6663 9.57219 17.2021 9.90569 16.8112 10.3261L15.9998 11.1982L15.1884 10.3261C14.3987 9.4773 13.3277 9.00044 12.2109 9.00044C11.0941 9.00044 10.023 9.4773 9.23334 10.3261C8.44365 11.1749 8 12.3262 8 13.5266C8 14.727 8.44365 15.8782 9.23334 16.727L10.0447 17.5991L15.9998 24L21.9549 17.5991L22.7663 16.727C23.1574 16.3068 23.4677 15.8079 23.6794 15.2587C23.891 14.7096 24 14.121 24 13.5266C24 12.9321 23.891 12.3435 23.6794 11.7944C23.4677 11.2453 23.1574 10.7463 22.7663 10.3261Z"
      fill={currentColor}
      stroke={currentColor}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShareIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="21"
    viewBox="0 0 18 21"
    fill="none"
  >
    <path
      d="M14.3331 6.94421C15.806 6.94421 17 5.75021 17 4.27734C17 2.80447 15.806 1.61047 14.3331 1.61047C12.8603 1.61047 11.6663 2.80447 11.6663 4.27734C11.6663 5.75021 12.8603 6.94421 14.3331 6.94421Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.66613 13.1669C5.139 13.1669 6.333 11.9729 6.333 10.5C6.333 9.02713 5.139 7.83313 3.66613 7.83313C2.19326 7.83313 0.999268 9.02713 0.999268 10.5C0.999268 11.9729 2.19326 13.1669 3.66613 13.1669Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.3331 19.3895C15.806 19.3895 17 18.1955 17 16.7227C17 15.2498 15.806 14.0558 14.3331 14.0558C12.8603 14.0558 11.6663 15.2498 11.6663 16.7227C11.6663 18.1955 12.8603 19.3895 14.3331 19.3895Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.96826 11.8424L12.0398 15.3804"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0309 5.61963L5.96826 9.15767"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Edit2Icon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11 3.99998H4C3.46957 3.99998 2.96086 4.2107 2.58579 4.58577C2.21071 4.96084 2 5.46955 2 5.99998V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MenuIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
  >
    <path
      d="M6 6.00203L25 6M6 14.501L25 14.499M6 23L25 22.998"
      stroke={currentColor}
      strokeWidth="3"
      strokeLinecap="square"
    />
  </svg>
);

export const GridIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
  >
    <path d="M10.5 1.75H1.75V10.5H10.5V1.75Z" fill={currentColor} />
    <path d="M24.25 1.75H15.5V10.5H24.25V1.75Z" fill={currentColor} />
    <path d="M24.25 15.5H15.5V24.25H24.25V15.5Z" fill={currentColor} />
    <path d="M10.5 15.5H1.75V24.25H10.5V15.5Z" fill={currentColor} />
    <path
      d="M10.5 1.75H1.75V10.5H10.5V1.75Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24.25 1.75H15.5V10.5H24.25V1.75Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24.25 15.5H15.5V24.25H24.25V15.5Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10.5 15.5H1.75V24.25H10.5V15.5Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.3556 5.2334L7.61675 13.9723L3.64453 10.0001"
      stroke={currentColor}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExcelIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M8.79948 8.00033L10.6655 10.667H9.06605L7.99977 9.14699L6.93349 10.667H5.33408L7.20006 8.00033L5.33408 5.33366H6.93349L7.99977 6.85366L9.06605 5.33366H9.99905V2.66699H3.3348V13.3337H12.6647V5.33366H10.6655L8.79948 8.00033ZM2.00195 2.00033C2.00195 1.81366 2.06637 1.65588 2.19522 1.52699C2.32406 1.3981 2.48178 1.33366 2.66838 1.33366H10.6655L13.9976 4.66699V14.0003C13.9976 14.1781 13.9332 14.3337 13.8043 14.467C13.6755 14.6003 13.5178 14.667 13.3312 14.667H2.66838C2.48178 14.667 2.32406 14.6025 2.19522 14.4737C2.06637 14.3448 2.00195 14.187 2.00195 14.0003V2.00033Z"
      fill="#22C55E"
    />
  </svg>
);

export const WordIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
  >
    <path
      d="M8.66547 4.33366V9.66699H7.33262L5.99977 8.33366L4.66692 9.66699H3.33408V4.33366H4.66692V7.66699L5.99977 6.33366L7.33262 7.66699V4.33366H7.99905V1.66699H1.3348V12.3337H10.6647V4.33366H8.66547ZM0.00195312 1.00033C0.00195312 0.81366 0.0663742 0.655882 0.195216 0.526993C0.324058 0.398104 0.481779 0.333659 0.668378 0.333659H8.66547L11.9976 3.66699V13.0003C11.9976 13.1781 11.9332 13.3337 11.8043 13.467C11.6755 13.6003 11.5178 13.667 11.3312 13.667H0.668378C0.481779 13.667 0.324058 13.6025 0.195216 13.4737C0.0663742 13.3448 0.00195312 13.187 0.00195312 13.0003V1.00033Z"
      fill="#3B82F6"
    />
  </svg>
);

export const PdfIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M7.99977 10.667H5.33408V5.33366H7.99977C8.4796 5.33366 8.92388 5.45366 9.33262 5.69366C9.74136 5.93366 10.0657 6.2581 10.3056 6.66699C10.5455 7.07588 10.6655 7.52033 10.6655 8.00033C10.6655 8.48033 10.5455 8.92477 10.3056 9.33366C10.0657 9.74255 9.74136 10.067 9.33262 10.307C8.92388 10.547 8.4796 10.667 7.99977 10.667ZM6.66692 6.66699V9.33366H7.99977C8.23969 9.33366 8.46183 9.27366 8.6662 9.15366C8.87057 9.03366 9.03273 8.87144 9.15269 8.66699C9.27264 8.46255 9.33262 8.24033 9.33262 8.00033C9.33262 7.76033 9.27264 7.5381 9.15269 7.33366C9.03273 7.12921 8.87057 6.96699 8.6662 6.84699C8.46183 6.72699 8.23969 6.66699 7.99977 6.66699H6.66692ZM9.99905 2.66699H3.3348V13.3337H12.6647V5.33366H9.99905V2.66699ZM2.00195 2.00033C2.00195 1.81366 2.06637 1.65588 2.19522 1.52699C2.32406 1.3981 2.48178 1.33366 2.66838 1.33366H10.6655L13.9976 4.66699V14.0003C13.9976 14.1781 13.9332 14.3337 13.8043 14.467C13.6755 14.6003 13.5178 14.667 13.3312 14.667H2.66838C2.48178 14.667 2.32406 14.6025 2.19522 14.4737C2.06637 14.3448 2.00195 14.187 2.00195 14.0003V2.00033Z"
      fill="#EF4444"
    />
  </svg>
);

export const SearchIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17.25 9.75C17.25 7.76088 16.4598 5.85322 15.0533 4.4467C13.6468 3.04018 11.7391 2.25 9.75 2.25C7.76088 2.25 5.85322 3.04018 4.4467 4.4467C3.04018 5.85322 2.25 7.76088 2.25 9.75C2.25 11.7391 3.04018 13.6468 4.4467 15.0533C5.85322 16.4598 7.76088 17.25 9.75 17.25C11.7391 17.25 13.6468 16.4598 15.0533 15.0533C16.4598 13.6468 17.25 11.7391 17.25 9.75ZM15.8016 17.3953C14.1422 18.7125 12.0375 19.5 9.75 19.5C4.36406 19.5 0 15.1359 0 9.75C0 4.36406 4.36406 0 9.75 0C15.1359 0 19.5 4.36406 19.5 9.75C19.5 12.0375 18.7125 14.1422 17.3953 15.8016L23.6719 22.0781C24.1125 22.5188 24.1125 23.2313 23.6719 23.6672C23.2313 24.1031 22.5188 24.1078 22.0828 23.6672L15.8016 17.3953Z"
      fill={currentColor}
    />
  </svg>
);

export const ExternalLinkIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
  >
    <path
      d="M9.3335 23.1668L22.6668 9.8335M22.6668 9.8335H9.3335M22.6668 9.8335V23.1668"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MoreIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 13 2"
    fill="none"
  >
    <circle cx="1.5" cy="1" r="1" fill={currentColor} />
    <circle cx="6.5" cy="1" r="1" fill={currentColor} />
    <circle cx="11.5" cy="1" r="1" fill={currentColor} />
  </svg>
);

export const MoreVerticalIcon = ({
  size = "size",
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M9.99992 9.16699C9.53968 9.16699 9.16659 9.54009 9.16659 10.0003C9.16659 10.4606 9.53968 10.8337 9.99992 10.8337C10.4602 10.8337 10.8333 10.4606 10.8333 10.0003C10.8333 9.54009 10.4602 9.16699 9.99992 9.16699Z"
      fill={currentColor}
    />
    <path
      d="M9.99992 15.0003C9.53968 15.0003 9.16659 15.3734 9.16659 15.8337C9.16659 16.2939 9.53968 16.667 9.99992 16.667C10.4602 16.667 10.8333 16.2939 10.8333 15.8337C10.8333 15.3734 10.4602 15.0003 9.99992 15.0003Z"
      fill={currentColor}
    />
    <path
      d="M9.99992 3.33366C9.53968 3.33366 9.16659 3.70676 9.16659 4.16699C9.16659 4.62723 9.53968 5.00033 9.99992 5.00033C10.4602 5.00033 10.8333 4.62723 10.8333 4.16699C10.8333 3.70676 10.4602 3.33366 9.99992 3.33366Z"
      fill={currentColor}
    />
    <path
      d="M9.99992 9.16699C9.53968 9.16699 9.16659 9.54009 9.16659 10.0003C9.16659 10.4606 9.53968 10.8337 9.99992 10.8337C10.4602 10.8337 10.8333 10.4606 10.8333 10.0003C10.8333 9.54009 10.4602 9.16699 9.99992 9.16699Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99992 15.0003C9.53968 15.0003 9.16659 15.3734 9.16659 15.8337C9.16659 16.2939 9.53968 16.667 9.99992 16.667C10.4602 16.667 10.8333 16.2939 10.8333 15.8337C10.8333 15.3734 10.4602 15.0003 9.99992 15.0003Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99992 3.33366C9.53968 3.33366 9.16659 3.70676 9.16659 4.16699C9.16659 4.62723 9.53968 5.00033 9.99992 5.00033C10.4602 5.00033 10.8333 4.62723 10.8333 4.16699C10.8333 3.70676 10.4602 3.33366 9.99992 3.33366Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HomeIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M8 18.3332V9.99984H13V18.3332M3 7.49984L10.5 1.6665L18 7.49984V16.6665C18 17.1085 17.8244 17.5325 17.5118 17.845C17.1993 18.1576 16.7754 18.3332 16.3333 18.3332H4.66667C4.22464 18.3332 3.80072 18.1576 3.48816 17.845C3.17559 17.5325 3 17.1085 3 16.6665V7.49984Z"
      stroke={currentColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserPlusIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <g clipPath="url(#clip0_907_2851)">
      <path
        d="M13.8335 17.5V15.8333C13.8335 14.9493 13.4823 14.1014 12.8572 13.4763C12.2321 12.8512 11.3842 12.5 10.5002 12.5H4.66683C3.78277 12.5 2.93493 12.8512 2.30981 13.4763C1.68469 14.1014 1.3335 14.9493 1.3335 15.8333V17.5M17.1668 6.66667V11.6667M19.6668 9.16667H14.6668M10.9168 5.83333C10.9168 7.67428 9.42445 9.16667 7.5835 9.16667C5.74255 9.16667 4.25016 7.67428 4.25016 5.83333C4.25016 3.99238 5.74255 2.5 7.5835 2.5C9.42445 2.5 10.9168 3.99238 10.9168 5.83333Z"
        stroke={currentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_907_2851">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export const ListIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M7.16667 5H18M7.16667 10H18M7.16667 15H18M3 5H3.00833M3 10H3.00833M3 15H3.00833"
      stroke={currentColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BellOutlineIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M11.9417 17.5001C11.7952 17.7526 11.5849 17.9623 11.3319 18.108C11.0788 18.2538 10.792 18.3305 10.5 18.3305C10.208 18.3305 9.92116 18.2538 9.66814 18.108C9.41513 17.9623 9.20484 17.7526 9.05833 17.5001M15.5 6.66675C15.5 5.34067 14.9732 4.0689 14.0355 3.13121C13.0979 2.19353 11.8261 1.66675 10.5 1.66675C9.17392 1.66675 7.90215 2.19353 6.96447 3.13121C6.02678 4.0689 5.5 5.34067 5.5 6.66675C5.5 12.5001 3 14.1667 3 14.1667H18C18 14.1667 15.5 12.5001 15.5 6.66675Z"
      stroke={currentColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UsersIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <g clipPath="url(#clip0_907_903)">
      <path
        d="M14.6668 17.5V15.8333C14.6668 14.9493 14.3156 14.1014 13.6905 13.4763C13.0654 12.8512 12.2176 12.5 11.3335 12.5H4.66683C3.78277 12.5 2.93493 12.8512 2.30981 13.4763C1.68469 14.1014 1.3335 14.9493 1.3335 15.8333V17.5M19.6668 17.5V15.8333C19.6663 15.0948 19.4205 14.3773 18.968 13.7936C18.5155 13.2099 17.8819 12.793 17.1668 12.6083M13.8335 2.60833C14.5505 2.79192 15.186 3.20892 15.6399 3.79359C16.0937 4.37827 16.34 5.09736 16.34 5.8375C16.34 6.57764 16.0937 7.29673 15.6399 7.88141C15.186 8.46608 14.5505 8.88308 13.8335 9.06667M11.3335 5.83333C11.3335 7.67428 9.84111 9.16667 8.00016 9.16667C6.15921 9.16667 4.66683 7.67428 4.66683 5.83333C4.66683 3.99238 6.15921 2.5 8.00016 2.5C9.84111 2.5 11.3335 3.99238 11.3335 5.83333Z"
        stroke={currentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_907_903">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export const HeartMenuIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M17.8666 3.84172C17.441 3.41589 16.9356 3.0781 16.3794 2.84763C15.8232 2.61716 15.227 2.49854 14.6249 2.49854C14.0229 2.49854 13.4267 2.61716 12.8705 2.84763C12.3143 3.0781 11.8089 3.41589 11.3833 3.84172L10.4999 4.72506L9.6166 3.84172C8.75686 2.98198 7.5908 2.49898 6.37494 2.49898C5.15908 2.49898 3.99301 2.98198 3.13327 3.84172C2.27353 4.70147 1.79053 5.86753 1.79053 7.08339C1.79053 8.29925 2.27353 9.46531 3.13327 10.3251L10.4999 17.6917L17.8666 10.3251C18.2924 9.89943 18.6302 9.39407 18.8607 8.83785C19.0912 8.28164 19.2098 7.68546 19.2098 7.08339C19.2098 6.48132 19.0912 5.88514 18.8607 5.32893C18.6302 4.77271 18.2924 4.26735 17.8666 3.84172Z"
      stroke={currentColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SettingsIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  >
    <g clipPath="url(#clip0_907_2866)">
      <path
        d="M10.5002 12.4999C11.8809 12.4999 13.0002 11.3806 13.0002 9.99992C13.0002 8.61921 11.8809 7.49992 10.5002 7.49992C9.11945 7.49992 8.00016 8.61921 8.00016 9.99992C8.00016 11.3806 9.11945 12.4999 10.5002 12.4999Z"
        stroke={currentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6668 12.4999C16.5559 12.7513 16.5228 13.0301 16.5718 13.3004C16.6208 13.5707 16.7497 13.8202 16.9418 14.0166L16.9918 14.0666C17.1468 14.2214 17.2697 14.4052 17.3536 14.6075C17.4375 14.8098 17.4806 15.0267 17.4806 15.2458C17.4806 15.4648 17.4375 15.6817 17.3536 15.884C17.2697 16.0863 17.1468 16.2701 16.9918 16.4249C16.837 16.5799 16.6532 16.7028 16.4509 16.7867C16.2486 16.8706 16.0317 16.9137 15.8127 16.9137C15.5936 16.9137 15.3768 16.8706 15.1744 16.7867C14.9721 16.7028 14.7883 16.5799 14.6335 16.4249L14.5835 16.3749C14.3871 16.1828 14.1376 16.0539 13.8673 16.0049C13.597 15.9559 13.3182 15.989 13.0668 16.0999C12.8204 16.2056 12.6101 16.381 12.4621 16.6045C12.314 16.8281 12.2346 17.0901 12.2335 17.3582V17.4999C12.2335 17.9419 12.0579 18.3659 11.7453 18.6784C11.4328 18.991 11.0089 19.1666 10.5668 19.1666C10.1248 19.1666 9.70088 18.991 9.38832 18.6784C9.07576 18.3659 8.90016 17.9419 8.90016 17.4999V17.4249C8.89371 17.1491 8.80443 16.8816 8.64392 16.6572C8.48341 16.4328 8.25911 16.2618 8.00016 16.1666C7.74882 16.0557 7.47 16.0226 7.19967 16.0716C6.92934 16.1206 6.67989 16.2495 6.4835 16.4416L6.4335 16.4916C6.27871 16.6465 6.09489 16.7695 5.89256 16.8533C5.69023 16.9372 5.47335 16.9804 5.25433 16.9804C5.0353 16.9804 4.81843 16.9372 4.6161 16.8533C4.41377 16.7695 4.22995 16.6465 4.07516 16.4916C3.9202 16.3368 3.79727 16.153 3.7134 15.9507C3.62952 15.7483 3.58635 15.5314 3.58635 15.3124C3.58635 15.0934 3.62952 14.8765 3.7134 14.6742C3.79727 14.4719 3.9202 14.288 4.07516 14.1333L4.12516 14.0833C4.31728 13.8869 4.44615 13.6374 4.49517 13.3671C4.54418 13.0967 4.51109 12.8179 4.40016 12.5666C4.29453 12.3201 4.11913 12.1099 3.89555 11.9618C3.67198 11.8138 3.40998 11.7343 3.14183 11.7333H3.00016C2.55814 11.7333 2.13421 11.5577 1.82165 11.2451C1.50909 10.9325 1.3335 10.5086 1.3335 10.0666C1.3335 9.62456 1.50909 9.20063 1.82165 8.88807C2.13421 8.57551 2.55814 8.39992 3.00016 8.39992H3.07516C3.35099 8.39347 3.6185 8.30418 3.84291 8.14368C4.06732 7.98317 4.23826 7.75886 4.3335 7.49992C4.44442 7.24857 4.47752 6.96976 4.4285 6.69943C4.37948 6.4291 4.25061 6.17965 4.0585 5.98325L4.0085 5.93325C3.85354 5.77846 3.7306 5.59465 3.64673 5.39232C3.56286 5.18999 3.51968 4.97311 3.51968 4.75408C3.51968 4.53506 3.56286 4.31818 3.64673 4.11585C3.7306 3.91352 3.85354 3.72971 4.0085 3.57492C4.16328 3.41996 4.3471 3.29703 4.54943 3.21315C4.75176 3.12928 4.96864 3.08611 5.18766 3.08611C5.40669 3.08611 5.62357 3.12928 5.8259 3.21315C6.02823 3.29703 6.21204 3.41996 6.36683 3.57492L6.41683 3.62492C6.61323 3.81703 6.86268 3.94591 7.133 3.99492C7.40333 4.04394 7.68215 4.01085 7.9335 3.89992H8.00016C8.24664 3.79428 8.45684 3.61888 8.60491 3.39531C8.75297 3.17173 8.83243 2.90974 8.8335 2.64159V2.49992C8.8335 2.05789 9.00909 1.63397 9.32165 1.32141C9.63421 1.00885 10.0581 0.833252 10.5002 0.833252C10.9422 0.833252 11.3661 1.00885 11.6787 1.32141C11.9912 1.63397 12.1668 2.05789 12.1668 2.49992V2.57492C12.1679 2.84307 12.2474 3.10506 12.3954 3.32864C12.5435 3.55221 12.7537 3.72762 13.0002 3.83325C13.2515 3.94418 13.5303 3.97727 13.8007 3.92826C14.071 3.87924 14.3204 3.75037 14.5168 3.55825L14.5668 3.50825C14.7216 3.35329 14.9054 3.23036 15.1078 3.14649C15.3101 3.06261 15.527 3.01944 15.746 3.01944C15.965 3.01944 16.1819 3.06261 16.3842 3.14649C16.5866 3.23036 16.7704 3.35329 16.9252 3.50825C17.0801 3.66304 17.2031 3.84685 17.2869 4.04918C17.3708 4.25151 17.414 4.46839 17.414 4.68742C17.414 4.90644 17.3708 5.12332 17.2869 5.32565C17.2031 5.52798 17.0801 5.7118 16.9252 5.86658L16.8752 5.91658C16.683 6.11298 16.5542 6.36243 16.5052 6.63276C16.4561 6.90309 16.4892 7.1819 16.6002 7.43325V7.49992C16.7058 7.74639 16.8812 7.9566 17.1048 8.10466C17.3283 8.25272 17.5903 8.33218 17.8585 8.33325H18.0002C18.4422 8.33325 18.8661 8.50885 19.1787 8.82141C19.4912 9.13397 19.6668 9.55789 19.6668 9.99992C19.6668 10.4419 19.4912 10.8659 19.1787 11.1784C18.8661 11.491 18.4422 11.6666 18.0002 11.6666H17.9252C17.657 11.6677 17.395 11.7471 17.1714 11.8952C16.9479 12.0432 16.7725 12.2534 16.6668 12.4999Z"
        stroke={currentColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_907_2866">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export const calendarIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="31"
    viewBox="0 0 28 31"
    fill="none"
  >
    <path
      d="M20.5134 7.78882H7.66133C6.64733 7.78882 5.82532 8.70216 5.82532 9.82883V24.1089C5.82532 25.2356 6.64733 26.149 7.66133 26.149H20.5134C21.5274 26.149 22.3494 25.2356 22.3494 24.1089V9.82883C22.3494 8.70216 21.5274 7.78882 20.5134 7.78882Z"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.7604 5.75043V9.83046"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.4132 5.75043V9.83046"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.82532 13.9119H22.3494"
      stroke={currentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EditIcon = ({ size = "size", currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M9.5 17.2678H17M13.25 3.51777C13.5815 3.18625 14.0312 3 14.5 3C14.7321 3 14.962 3.04572 15.1765 3.13456C15.391 3.2234 15.5858 3.35361 15.75 3.51777C15.9142 3.68192 16.0444 3.8768 16.1332 4.09127C16.222 4.30575 16.2678 4.53562 16.2678 4.76777C16.2678 4.99991 16.222 5.22979 16.1332 5.44426C16.0444 5.65874 15.9142 5.85361 15.75 6.01777L5.33333 16.4344L2 17.2678L2.83333 13.9344L13.25 3.51777Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = ({ currentColor = "currentColor", size = "size" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      d="M10.4998 4.16675V15.8334M4.6665 10.0001H16.3332"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MinusIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="4"
    viewBox="0 0 32 4"
    fill="none"
  >
    <path
      d="M2 2H30"
      stroke="#EFEFF0"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M20.1366 20V18.0564C20.1366 17.0254 19.727 16.0366 18.998 15.3076C18.269 14.5786 17.2803 14.1691 16.2493 14.1691H8.4747C7.44372 14.1691 6.45497 14.5786 5.72596 15.3076C4.99696 16.0366 4.5874 17.0254 4.5874 18.0564V20"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3619 11.2536C14.5088 11.2536 16.2492 9.51319 16.2492 7.3663C16.2492 5.2194 14.5088 3.479 12.3619 3.479C10.215 3.479 8.47461 5.2194 8.47461 7.3663C8.47461 9.51319 10.215 11.2536 12.3619 11.2536Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LocationIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="20"
    viewBox="0 0 16 20"
    fill="none"
  >
    <path
      d="M14.5 7.47795C14.5 12.2052 8 18.5786 8 18.5786C8 18.5786 1.5 12.2052 1.5 7.47795C1.5 5.86598 2.18482 4.32004 3.40381 3.18021C4.62279 2.04038 6.27609 1.40002 8 1.40002C9.72391 1.40002 11.3772 2.04038 12.5962 3.18021C13.8152 4.32004 14.5 5.86598 14.5 7.47795Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99992 9.58835C9.2587 9.58835 10.2791 8.56791 10.2791 7.30913C10.2791 6.05035 9.2587 5.02991 7.99992 5.02991C6.74115 5.02991 5.7207 6.05035 5.7207 7.30913C5.7207 8.56791 6.74115 9.58835 7.99992 9.58835Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ConnectionIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
  >
    <line
      x1="13.9944"
      y1="0.657234"
      x2="1.99437"
      y2="16.2572"
      stroke={currentColor}
      strokeWidth="1.5"
    />
    <circle
      cx="12.7998"
      cy="12.8"
      r="2.25"
      stroke={currentColor}
      strokeWidth="1.5"
    />
    <circle
      cx="3.2002"
      cy="4.40002"
      r="2.25"
      stroke={currentColor}
      strokeWidth="1.5"
    />
  </svg>
);

export const WalletIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
  >
    <path
      d="M15.4 4H2.6C1.71634 4 1 4.71634 1 5.6V13.6C1 14.4837 1.71634 15.2 2.6 15.2H15.4C16.2837 15.2 17 14.4837 17 13.6V5.6C17 4.71634 16.2837 4 15.4 4Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1998 15.2V2.40005C12.1998 1.9757 12.0312 1.56874 11.7312 1.26868C11.4311 0.96862 11.0242 0.800049 10.5998 0.800049H7.3998C6.97546 0.800049 6.56849 0.96862 6.26843 1.26868C5.96838 1.56874 5.7998 1.9757 5.7998 2.40005V15.2"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PhoneIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19.0557 15.4457V17.5532C19.0565 17.7489 19.0164 17.9426 18.9378 18.1218C18.8593 18.3011 18.7441 18.462 18.5996 18.5943C18.4552 18.7266 18.2846 18.8273 18.0989 18.8899C17.9132 18.9526 17.7164 18.9759 17.5212 18.9583C15.3551 18.7234 13.2745 17.9847 11.4464 16.8015C9.7456 15.7229 8.30364 14.2838 7.22289 12.5864C6.03325 10.7537 5.29292 8.66704 5.06187 6.49555C5.04428 6.30128 5.06741 6.10549 5.12979 5.92063C5.19218 5.73577 5.29245 5.5659 5.42422 5.42184C5.55599 5.27777 5.71637 5.16267 5.89516 5.08385C6.07394 5.00504 6.26721 4.96424 6.46266 4.96406H8.57441C8.91602 4.9607 9.2472 5.08143 9.50622 5.30375C9.76524 5.52607 9.93443 5.8348 9.98224 6.17239C10.0714 6.84686 10.2367 7.5091 10.475 8.14648C10.5697 8.39793 10.5902 8.6712 10.534 8.93392C10.4779 9.19664 10.3475 9.43779 10.1582 9.6288L9.26425 10.521C10.2663 12.2798 11.7255 13.7361 13.4877 14.7361L14.3817 13.8439C14.5731 13.655 14.8147 13.5249 15.078 13.4688C15.3412 13.4128 15.615 13.4333 15.867 13.5278C16.5056 13.7656 17.1692 13.9306 17.845 14.0196C18.1869 14.0677 18.4992 14.2396 18.7224 14.5025C18.9457 14.7655 19.0643 15.1011 19.0557 15.4457Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DollarIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 4V20M15.3333 6.90909H10.3333C9.71449 6.90909 9.121 7.17727 8.68342 7.65464C8.24583 8.132 8 8.77945 8 9.45455C8 10.1296 8.24583 10.7771 8.68342 11.2545C9.121 11.7318 9.71449 12 10.3333 12H13.6667C14.2855 12 14.879 12.2682 15.3166 12.7455C15.7542 13.2229 16 13.8704 16 14.5455C16 15.2206 15.7542 15.868 15.3166 16.3454C14.879 16.8227 14.2855 17.0909 13.6667 17.0909H8"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export const EyeIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3 12C3 12 6.27273 6 12 6C17.7273 6 21 12 21 12C21 12 17.7273 18 12 18C6.27273 18 3 12 3 12Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 14.25C13.3556 14.25 14.4545 13.2426 14.4545 12C14.4545 10.7574 13.3556 9.75 12 9.75C10.6444 9.75 9.54545 10.7574 9.54545 12C9.54545 13.2426 10.6444 14.25 12 14.25Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CommentIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M15 10.3333C15 10.7459 14.8361 11.1416 14.5444 11.4333C14.2527 11.725 13.857 11.8889 13.4444 11.8889H4.11111L1 15V2.55556C1 2.143 1.16389 1.74733 1.45561 1.45561C1.74733 1.16389 2.143 1 2.55556 1H13.4444C13.857 1 14.2527 1.16389 14.5444 1.45561C14.8361 1.74733 15 2.143 15 2.55556V10.3333Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EyeSmallIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M2 8C2 8 4.18182 4 8 4C11.8182 4 14 8 14 8C14 8 11.8182 12 8 12C4.18182 12 2 8 2 8Z"
      stroke={currentColor}
      strokeLinecap="round"
    />
    <path
      d="M8 9.5C8.90374 9.5 9.63636 8.82843 9.63636 8C9.63636 7.17157 8.90374 6.5 8 6.5C7.09626 6.5 6.36364 7.17157 6.36364 8C6.36364 8.82843 7.09626 9.5 8 9.5Z"
      stroke={currentColor}
      strokeLinecap="round"
    />
  </svg>
);

export const DocumentIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12.75 4H7.5C7.10218 4 6.72064 4.15804 6.43934 4.43934C6.15804 4.72064 6 5.10218 6 5.5V17.5C6 17.8978 6.15804 18.2794 6.43934 18.5607C6.72064 18.842 7.10218 19 7.5 19H16.5C16.8978 19 17.2794 18.842 17.5607 18.5607C17.842 18.2794 18 17.8978 18 17.5V9.25M12.75 4L18 9.25M12.75 4V9.25H18"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InfoIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 15.2V12M12 8.8H12.008M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MailIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19.1998 7.5C19.1998 6.675 18.5518 6 17.7598 6H6.2398C5.4478 6 4.7998 6.675 4.7998 7.5M19.1998 7.5V16.5C19.1998 17.325 18.5518 18 17.7598 18H6.2398C5.4478 18 4.7998 17.325 4.7998 16.5V7.5M19.1998 7.5L11.9998 12.75L4.7998 7.5"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M20.5 11.9995H9.14676M9.14676 11.9995C9.14676 12.5588 8.93478 13.0951 8.5591 13.4906C8.18342 13.886 7.67389 14.1082 7.14259 14.1082C6.6113 14.1082 6.10177 13.886 5.72609 13.4906C5.35041 13.0951 5.13935 12.5588 5.13935 11.9995M9.14676 11.9995C9.14676 11.4403 8.93478 10.9039 8.5591 10.5085C8.18342 10.113 7.67389 9.89084 7.14259 9.89084C6.6113 9.89084 6.10177 10.113 5.72609 10.5085C5.35041 10.9039 5.13935 11.4403 5.13935 11.9995M5.13935 11.9995H3.5M20.5 18.3904H15.2181M15.2181 18.3904C15.2181 18.9497 15.0065 19.4867 14.6307 19.8822C14.255 20.2778 13.7453 20.5 13.2139 20.5C12.6826 20.5 12.1731 20.2769 11.7974 19.8814C11.4217 19.486 11.2106 18.9496 11.2106 18.3904M15.2181 18.3904C15.2181 17.831 15.0065 17.295 14.6307 16.8994C14.255 16.5039 13.7453 16.2817 13.2139 16.2817C12.6826 16.2817 12.1731 16.5038 11.7974 16.8993C11.4217 17.2947 11.2106 17.8311 11.2106 18.3904M11.2106 18.3904H3.5M20.5 5.60868H17.6468M17.6468 5.60868C17.6468 5.88559 17.594 6.1598 17.4934 6.41563C17.3927 6.67147 17.2451 6.90393 17.0591 7.09974C16.8731 7.29555 16.6522 7.45087 16.4092 7.55684C16.1662 7.66281 15.9057 7.71735 15.6426 7.71735C15.1113 7.71735 14.6018 7.49519 14.2261 7.09974C13.8504 6.70428 13.6394 6.16793 13.6394 5.60868M17.6468 5.60868C17.6468 5.33176 17.594 5.05756 17.4934 4.80172C17.3927 4.54588 17.2451 4.31343 17.0591 4.11762C16.8731 3.92181 16.6522 3.76648 16.4092 3.66051C16.1662 3.55454 15.9057 3.5 15.6426 3.5C15.1113 3.5 14.6018 3.72216 14.2261 4.11762C13.8504 4.51307 13.6394 5.04942 13.6394 5.60868M13.6394 5.60868H3.5"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);

export const ArrowRightIcon = ({
  size = "size",
  currentColor = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M5 12L19 12M19 12L12 5M19 12L12 19"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M2.5 4.99996H4.16667M4.16667 4.99996H17.5M4.16667 4.99996V16.6666C4.16667 17.1087 4.34226 17.5326 4.65482 17.8451C4.96738 18.1577 5.39131 18.3333 5.83333 18.3333H14.1667C14.6087 18.3333 15.0326 18.1577 15.3452 17.8451C15.6577 17.5326 15.8333 17.1087 15.8333 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.89127 6.84226 2.46734 7.15482 2.15478C7.46738 1.84222 7.89131 1.66663 8.33333 1.66663H11.6667C12.1087 1.66663 12.5326 1.84222 12.8452 2.15478C13.1577 2.46734 13.3333 2.89127 13.3333 3.33329V4.99996M8.33333 9.16663V14.1666M11.6667 9.16663V14.1666"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BellIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = ({ size = "size", currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 17 16"
    fill="none"
  >
    <line
      x1="1.56066"
      y1="1"
      x2="15.3492"
      y2="14.7886"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="0.75"
      y1="-0.75"
      x2="20.25"
      y2="-0.75"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 16.5 1)"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const UploadIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M28 20V25.3333C28 26.0406 27.719 26.7189 27.219 27.219C26.7189 27.719 26.0406 28 25.3333 28H6.66667C5.95942 28 5.28115 27.719 4.78105 27.219C4.28095 26.7189 4 26.0406 4 25.3333V20M22.6667 10.6667L16 4M16 4L9.33333 10.6667M16 4V20"
      stroke={currentColor}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoublePrevIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M11.728 12L12.668 11.06L9.61464 8L12.668 4.94L11.728 4L7.72797 8L11.728 12Z"
      fill={currentColor}
    />
    <path
      d="M7.33344 12L8.27344 11.06L5.2201 8L8.27344 4.94L7.33344 4L3.33344 8L7.33344 12Z"
      fill={currentColor}
    />
  </svg>
);

export const PrevIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z"
      fill={currentColor}
    />
  </svg>
);

export const NextIcon = ({ size = "size", currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6.94 4L6 4.94L9.05333 8L6 11.06L6.94 12L10.94 8L6.94 4Z"
      fill={currentColor}
    />
  </svg>
);

export const DoubleNextIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M4.27203 4L3.33203 4.94L6.38536 8L3.33203 11.06L4.27203 12L8.27203 8L4.27203 4Z"
      fill={currentColor}
    />
    <path
      d="M8.66656 4L7.72656 4.94L10.7799 8L7.72656 11.06L8.66656 12L12.6666 8L8.66656 4Z"
      fill={currentColor}
    />
  </svg>
);

export const LinkIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
  >
    <path
      d="M16.4221 8.85562C16.6176 8.66017 16.6176 8.33862 16.4221 8.14316L11.8826 3.60362C11.6871 3.40817 11.3656 3.40817 11.1701 3.60362C10.9747 3.79907 10.9747 4.12062 11.1701 4.31608L14.849 7.995H0.934081C0.656665 7.995 0.429688 8.22198 0.429688 8.49939C0.429688 8.77681 0.656665 9.00379 0.934081 9.00379H14.849L11.1701 12.6827C10.9747 12.8782 10.9747 13.1997 11.1701 13.3952C11.3656 13.5906 11.6871 13.5906 11.8826 13.3952L16.4221 8.85562Z"
      fill={currentColor}
    />
  </svg>
);

export const ImageIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="31"
    viewBox="0 0 30 31"
    fill="none"
  >
    <path
      d="M6.25 26.875H23.75C25.1307 26.875 26.25 25.7557 26.25 24.375V6.875C26.25 5.49429 25.1307 4.375 23.75 4.375H6.25C4.86929 4.375 3.75 5.49429 3.75 6.875V24.375C3.75 25.7557 4.86929 26.875 6.25 26.875ZM6.25 26.875L20 13.125L26.25 19.375M12.5 11.25C12.5 12.2855 11.6605 13.125 10.625 13.125C9.58947 13.125 8.75 12.2855 8.75 11.25C8.75 10.2145 9.58947 9.375 10.625 9.375C11.6605 9.375 12.5 10.2145 12.5 11.25Z"
      stroke={currentColor}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WebIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
  >
    <path
      d="M9.5 17C13.9183 17 17.5 13.4183 17.5 9C17.5 4.58172 13.9183 1 9.5 1C5.08172 1 1.5 4.58172 1.5 9C1.5 13.4183 5.08172 17 9.5 17Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.4998 17C11.2671 17 12.6998 13.4183 12.6998 9C12.6998 4.58172 11.2671 1 9.4998 1C7.73249 1 6.2998 4.58172 6.2998 9C6.2998 13.4183 7.73249 17 9.4998 17Z"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.5 9H17.5"
      stroke={currentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PageIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
  >
    <path
      d="M12.826 4.33268V12.9993C12.826 13.186 12.7615 13.3438 12.6327 13.4727C12.5039 13.6016 12.3461 13.666 12.1595 13.666H1.49675C1.31015 13.666 1.15243 13.6016 1.02359 13.4727C0.894743 13.3438 0.830322 13.186 0.830322 12.9993V0.99935C0.830322 0.812683 0.894743 0.654905 1.02359 0.526016C1.15243 0.397127 1.31015 0.332683 1.49675 0.332683H8.82742L12.826 4.33268ZM11.4931 4.99935H8.16099V1.66602H2.16317V12.3327H11.4931V4.99935ZM4.16244 3.66602H6.16172V4.99935H4.16244V3.66602ZM4.16244 6.33268H9.49384V7.66602H4.16244V6.33268ZM4.16244 8.99935H9.49384V10.3327H4.16244V8.99935Z"
      fill={currentColor}
    />
  </svg>
);

export const Link2Icon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M12.4257 10.3594L11.4794 9.41273L12.4257 8.46607C12.8521 8.0394 13.1409 7.54162 13.292 6.97273C13.443 6.40384 13.443 5.83273 13.292 5.2594C13.1409 4.68607 12.8521 4.18607 12.4257 3.7594C11.9992 3.33273 11.4994 3.04385 10.9263 2.89273C10.3532 2.74162 9.78236 2.74162 9.21371 2.89273C8.64507 3.04385 8.1475 3.33273 7.72102 3.7594L6.77476 4.70607L5.8285 3.7594L6.77476 2.81273C7.37006 2.21718 8.07642 1.81273 8.89385 1.5994C9.67574 1.39496 10.4621 1.39496 11.2528 1.5994C12.0703 1.81273 12.7766 2.21718 13.3719 2.81273C13.9672 3.40829 14.3715 4.11496 14.5847 4.93273C14.7891 5.72385 14.7891 6.51051 14.5847 7.29273C14.3715 8.11051 13.9672 8.81718 13.3719 9.41273L12.4257 10.3594ZM10.5465 12.2394L9.60021 13.1861C9.00491 13.7816 8.29855 14.1861 7.48112 14.3994C6.69923 14.6038 5.91291 14.6038 5.12213 14.3994C4.30471 14.1861 3.59834 13.7816 3.00304 13.1861C2.40774 12.5905 2.00347 11.8838 1.79023 11.0661C1.58587 10.275 1.58587 9.48829 1.79023 8.70607C2.00347 7.88829 2.40774 7.18162 3.00304 6.58607L3.9493 5.6394L4.89556 6.58607L3.9493 7.53273C3.52282 7.9594 3.23406 8.45718 3.08301 9.02607C2.93196 9.59496 2.93196 10.1661 3.08301 10.7394C3.23406 11.3127 3.52282 11.8127 3.9493 12.2394C4.37579 12.6661 4.87557 12.955 5.44866 13.1061C6.02175 13.2572 6.59261 13.2572 7.16126 13.1061C7.7299 12.955 8.22747 12.6661 8.65395 12.2394L9.60021 11.2927L10.5465 12.2394ZM10.0667 5.17273L11.0129 6.1194L6.30829 10.8261L5.36203 9.8794L10.0667 5.17273Z"
      fill={currentColor}
    />
  </svg>
);

export const DownloadIcon = ({ currentColor = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M2 13.0007H13.9956V14.334H2V13.0007ZM8.66424 9.12065L12.7161 5.06732L13.6491 6.01398L7.99782 11.6673L2.34654 6.01398L3.27953 5.06732L7.3314 9.12065V1.66732H8.66424V9.12065Z"
      fill={currentColor}
    />
  </svg>
);

// Star Rating Icons
export const StarEmptyIcon = ({ size = 24, currentColor = "#EFEFF0" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.7075 2.66309C11.8251 2.4173 12.1749 2.41734 12.2925 2.66309L14.6382 7.5791C14.78 7.87619 15.0628 8.08095 15.3892 8.12402L20.7886 8.83594C21.0588 8.87156 21.1675 9.2047 20.9702 9.39258L17.02 13.1426C16.7811 13.3693 16.6729 13.7015 16.7329 14.0254L17.7241 19.3809C17.7737 19.649 17.4902 19.8547 17.2505 19.7246L12.4644 17.127C12.1749 16.9698 11.8251 16.9698 11.5356 17.127L6.74951 19.7246C6.50979 19.8547 6.22632 19.649 6.27588 19.3809L7.26709 14.0254C7.32706 13.7015 7.21885 13.3693 6.97998 13.1426L3.03076 9.39258C2.83291 9.20477 2.94097 8.87159 3.21143 8.83594L8.61084 8.12402C8.93727 8.08099 9.21993 7.8762 9.36182 7.5791L11.7075 2.66309Z"
      fill="#EFEFF0"
      stroke="#CACAD2"
      strokeWidth="0.648649"
    />
  </svg>
);

export const StarFilledIcon = ({ size = 24, currentColor = "#FF8796" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.7075 2.66309C11.8251 2.4173 12.1749 2.41734 12.2925 2.66309L14.6382 7.5791C14.78 7.87619 15.0628 8.08095 15.3892 8.12402L20.7886 8.83594C21.0588 8.87156 21.1675 9.2047 20.9702 9.39258L17.02 13.1426C16.7811 13.3693 16.6729 13.7015 16.7329 14.0254L17.7241 19.3809C17.7737 19.649 17.4902 19.8547 17.2505 19.7246L12.4644 17.127C12.1749 16.9698 11.8251 16.9698 11.5356 17.127L6.74951 19.7246C6.50979 19.8547 6.22632 19.649 6.27588 19.3809L7.26709 14.0254C7.32706 13.7015 7.21885 13.3693 6.97998 13.1426L3.03076 9.39258C2.83291 9.20477 2.94097 8.87159 3.21143 8.83594L8.61084 8.12402C8.93727 8.08099 9.21993 7.8762 9.36182 7.5791L11.7075 2.66309Z"
      fill="#FF8796"
      stroke="#FF8796"
      strokeWidth="0.648649"
    />
  </svg>
);

export const StarHalfIcon = ({ size = 24, currentColor = "#FF8796" }) => {
  const clipId = `half-clip-${Math.random().toString(36).substring(2, 11)}`;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      {/* Empty star background */}
      <path
        d="M11.7075 2.66309C11.8251 2.4173 12.1749 2.41734 12.2925 2.66309L14.6382 7.5791C14.78 7.87619 15.0628 8.08095 15.3892 8.12402L20.7886 8.83594C21.0588 8.87156 21.1675 9.2047 20.9702 9.39258L17.02 13.1426C16.7811 13.3693 16.6729 13.7015 16.7329 14.0254L17.7241 19.3809C17.7737 19.649 17.4902 19.8547 17.2505 19.7246L12.4644 17.127C12.1749 16.9698 11.8251 16.9698 11.5356 17.127L6.74951 19.7246C6.50979 19.8547 6.22632 19.649 6.27588 19.3809L7.26709 14.0254C7.32706 13.7015 7.21885 13.3693 6.97998 13.1426L3.03076 9.39258C2.83291 9.20477 2.94097 8.87159 3.21143 8.83594L8.61084 8.12402C8.93727 8.08099 9.21993 7.8762 9.36182 7.5791L11.7075 2.66309Z"
        fill="#EFEFF0"
        stroke="#CACAD2"
        strokeWidth="0.648649"
      />
      {/* Half filled star */}
      <path
        d="M11.7075 2.66309C11.8251 2.4173 12.1749 2.41734 12.2925 2.66309L14.6382 7.5791C14.78 7.87619 15.0628 8.08095 15.3892 8.12402L20.7886 8.83594C21.0588 8.87156 21.1675 9.2047 20.9702 9.39258L17.02 13.1426C16.7811 13.3693 16.6729 13.7015 16.7329 14.0254L17.7241 19.3809C17.7737 19.649 17.4902 19.8547 17.2505 19.7246L12.4644 17.127C12.1749 16.9698 11.8251 16.9698 11.5356 17.127L6.74951 19.7246C6.50979 19.8547 6.22632 19.649 6.27588 19.3809L7.26709 14.0254C7.32706 13.7015 7.21885 13.3693 6.97998 13.1426L3.03076 9.39258C2.83291 9.20477 2.94097 8.87159 3.21143 8.83594L8.61084 8.12402C8.93727 8.08099 9.21993 7.8762 9.36182 7.5791L11.7075 2.66309Z"
        fill={currentColor}
        stroke={currentColor}
        strokeWidth="0.648649"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
};

export const UpIcon = ({ size = "24", currentColor = "#FF8796" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7 14L12 9L17 14"
      stroke={currentColor}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DownIcon = ({ size = "24", currentColor = "#FF8796" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17 10L12 15L7 10"
      stroke={currentColor}
      strokeWidth="1.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
