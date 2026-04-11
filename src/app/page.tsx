import DeathForm from "@/components/death-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center tracking-widest text-zinc-100">
            DEATH EXPECTANCY
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            How much time do you really have left?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* เดี๋ยวเราจะสร้าง Client Component สำหรับฟอร์มแบบสอบถามมาใส่ตรงนี้ */}
          <div className="text-center text-sm text-zinc-600 py-12 border border-dashed border-zinc-800 rounded-lg mt-4">
            <DeathForm />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
