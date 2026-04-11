"use client"; // บรรทัดนี้สำคัญมาก! เป็นการประกาศว่าเป็น Client Component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeathForm() {
  return (
    <form className="space-y-4 mt-4">
      <div className="space-y-2 text-left">
        <Label htmlFor="dob" className="text-zinc-400">
          Date of Birth
        </Label>
        <Input
          id="dob"
          type="date"
          className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
        />
      </div>

      {/* เดี๋ยวเราจะมาเติมคำถามเรื่อง พฤติกรรม น้ำหนัก ส่วนสูง ทีหลัง */}

      <Button
        type="button"
        className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-bold tracking-widest mt-8"
      >
        CALCULATE MY FATE
      </Button>
    </form>
  );
}
