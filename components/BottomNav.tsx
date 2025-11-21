import Image from "next/image";
import Link from "next/link";

interface BottomNavProps {
  items?: Array<{
    icon: React.ReactNode;
    label: string;
    route?: string;
  }>;
}

export default function BottomNav({ items }: BottomNavProps) {
  // Default items for pemasukan/pengeluaran
  const defaultItems = [
    { icon: <Image src="/file.svg" alt="Pengaturan" width={24} height={24} />, label: "Pengaturan", route: "/pengaturan" },
    { icon: <Image src="/window.svg" alt="Beranda" width={24} height={24} />, label: "Beranda", route: "/homepage" },
    { icon: <Image src="/globe.svg" alt="Akun" width={24} height={24} />, label: "Akun", route: "/profile" },
  ];
  const navItems = items || defaultItems;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#232B3E] py-4 flex justify-center">
      <div className="flex gap-12">
        {navItems.map((item, idx) => (
          <Link href={item.route || "#"} key={idx} className="flex flex-col items-center">
            {item.icon}
            <span className="text-white text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
