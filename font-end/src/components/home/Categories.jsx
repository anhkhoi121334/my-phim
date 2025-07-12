import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faLaptop, faTabletAlt, faTv, faHeadphones, faGamepad } from '@fortawesome/free-solid-svg-icons';

const categories = [
  { icon: faMobileAlt, color: "text-indigo-500", bg: "bg-indigo-50", name: "Điện thoại", count: 124 },
  { icon: faLaptop, color: "text-purple-500", bg: "bg-purple-50", name: "Laptop", count: 87 },
  { icon: faTabletAlt, color: "text-sky-500", bg: "bg-sky-50", name: "Tablet", count: 56 },
  { icon: faTv, color: "text-amber-500", bg: "bg-amber-50", name: "Tivi", count: 42 },
  { icon: faHeadphones, color: "text-rose-500", bg: "bg-rose-50", name: "Tai nghe", count: 98 },
  { icon: faGamepad, color: "text-emerald-500", bg: "bg-emerald-50", name: "Gaming", count: 75 },
];

const Categories = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">Danh mục sản phẩm</h2>
        <p className="text-slate-600 text-base sm:text-lg">Khám phá đa dạng sản phẩm công nghệ chất lượng cao với giá cả cạnh tranh</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat, idx) => (
          <a key={idx} href="#" className="feature-card bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${cat.bg} flex items-center justify-center`}>
              <FontAwesomeIcon icon={cat.icon} className={`${cat.color} text-2xl feature-icon`} />
            </div>
            <h3 className="font-semibold text-slate-800">{cat.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{cat.count} sản phẩm</p>
          </a>
        ))}
      </div>
    </div>
  </section>
);
export default Categories; 