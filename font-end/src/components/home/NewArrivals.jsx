import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { productsAPI } from '../../utils/api';

const getStars = (rating) => {
  const stars = [];
  let r = Math.round(rating * 2) / 2;
  for (let i = 0; i < 5; i++) {
    if (r >= 1) stars.push(1);
    else if (r === 0.5) stars.push(0.5);
    else stars.push(0);
    r--;
  }
  return stars;
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = { sortBy: 'createdAt', sortOrder: 'desc', pageSize: 5 };
    productsAPI.getProducts(params)
      .then(res => {
        setProducts(res.data.data || []);
      })
      .catch(err => {
        setError(err.toString());
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-2">Sản phẩm mới nhất</h2>
            <p className="text-slate-600 text-base sm:text-lg">Các sản phẩm mới ra mắt trong tháng</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10 text-slate-500">Đang tải sản phẩm...</div>
        ) : error ? (
          <div className="text-center py-10 text-rose-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((p, idx) => (
              <div key={p._id || idx} className="bg-white rounded shadow-sm overflow-hidden product-card sm:p-6">
                <div className="relative pt-4 px-4 pb-2">
                  <div className="absolute top-2 left-2">
                    <span className="inline-block bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  </div>
                  <img src={p.mainImage || p.images?.[0] || 'https://via.placeholder.com/500x500'} alt={p.name} className="w-full aspect-square object-contain rounded" />
                </div>
                <div className="p-4 pt-2">
                  <h3 className="font-medium text-gray-800 text-base sm:text-lg mb-1">{p.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-2 line-clamp-2">{p.shortDescription || p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">{p.minPrice?.toLocaleString('vi-VN', {style:'currency',currency:'VND'}) || '--'}</span>
                    <div className="flex text-amber-400 text-sm">
                      {getStars(p.averageRating || 5).map((s, i) =>
                        s === 1 ? (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ) : s === 0.5 ? (
                          <FontAwesomeIcon key={i} icon={faStarHalfAlt} />
                        ) : (
                          <FontAwesomeIcon key={i} icon={faStar} className="text-slate-300" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals; 