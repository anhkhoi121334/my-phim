import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div className="flex flex-col items-center">
      <div className="bg-indigo-100 rounded-full p-6 mb-6">
        <i className="fas fa-exclamation-triangle text-5xl text-indigo-500"></i>
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
      >
        <i className="fas fa-arrow-left mr-2"></i> Về trang chủ
      </Link>
    </div>
  </div>
);

export default NotFoundPage; 