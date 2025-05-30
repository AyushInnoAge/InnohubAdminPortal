import { Suspense } from "react";
import TimeAttendance from "./Components/TimeAttendance";

export default function AttendancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimeAttendance />
    </Suspense>
  );
}