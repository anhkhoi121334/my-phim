import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faUsers, faShoppingBag, faEye, 
  faArrowUp, faArrowDown, faExchangeAlt, faPercent,
  faGlobe, faMobileAlt, faLaptop, faTabletAlt, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const AdminAnalyticsPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    salesSummary: {
      total: 158950000,
      previous: 142570000,
      change: 11.5
    },
    conversionRate: {
      rate: 3.8,
      previous: 3.5,
      change: 8.6
    },
    visitorsData: {
      total: 25840,
      previous: 24320,
      change: 6.2
    },
    averageOrderValue: {
      value: 2570000,
      previous: 2350000,
      change: 9.4
    },
    deviceDistribution: [
      { device: 'Mobile', percentage: 68, icon: faMobileAlt },
      { device: 'Desktop', percentage: 24, icon: faLaptop },
      { device: 'Tablet', percentage: 8, icon: faTabletAlt },
    ],
    topChannels: [
      { channel: 'Organic Search', visits: 8450, conversions: 385, convRate: 4.6 },
      { channel: 'Direct', visits: 6320, conversions: 275, convRate: 4.4 },
      { channel: 'Social Media', visits: 5240, conversions: 198, convRate: 3.8 },
      { channel: 'Referral', visits: 3680, conversions: 142, convRate: 3.9 },
      { channel: 'Email', visits: 2150, conversions: 95, convRate: 4.4 },
    ],
    monthlyData: [
      { month: 'T1', sales: 9500000, visitors: 1850, orders: 85 },
      { month: 'T2', sales: 10200000, visitors: 1920, orders: 92 },
      { month: 'T3', sales: 11800000, visitors: 2050, orders: 105 },
      { month: 'T4', sales: 12500000, visitors: 2180, orders: 112 },
      { month: 'T5', sales: 13200000, visitors: 2240, orders: 118 },
      { month: 'T6', sales: 12800000, visitors: 2190, orders: 115 },
      { month: 'T7', sales: 11900000, visitors: 2100, orders: 108 },
      { month: 'T8', sales: 12300000, visitors: 2150, orders: 111 },
      { month: 'T9', sales: 13600000, visitors: 2280, orders: 121 },
      { month: 'T10', sales: 15200000, visitors: 2420, orders: 132 },
      { month: 'T11', sales: 16800000, visitors: 2580, orders: 145 },
      { month: 'T12', sales: 19150000, visitors: 2880, orders: 167 },
    ]
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch data from your API
        // For this example, we'll use the mock data already set in state
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [period]);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Format to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Phân tích</h1>
          <p className="text-gray-600">Xem dữ liệu phân tích chi tiết về hoạt động của cửa hàng</p>
        </div>

        {/* Period Selection */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tuần này
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tháng này
          </button>
          <button 
            onClick={() => setPeriod('quarter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'quarter' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Quý này
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Năm nay
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Doanh thu</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(analyticsData.salesSummary.total)}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${analyticsData.salesSummary.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon 
                      icon={analyticsData.salesSummary.change >= 0 ? faArrowUp : faArrowDown} 
                      className="mr-1" 
                    />
                    {Math.abs(analyticsData.salesSummary.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tỷ lệ chuyển đổi</p>
                <h3 className="text-2xl font-bold text-gray-800">{analyticsData.conversionRate.rate}%</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${analyticsData.conversionRate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon 
                      icon={analyticsData.conversionRate.change >= 0 ? faArrowUp : faArrowDown} 
                      className="mr-1" 
                    />
                    {Math.abs(analyticsData.conversionRate.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faPercent} className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Visitors */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Lượt truy cập</p>
                <h3 className="text-2xl font-bold text-gray-800">{analyticsData.visitorsData.total.toLocaleString()}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${analyticsData.visitorsData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon 
                      icon={analyticsData.visitorsData.change >= 0 ? faArrowUp : faArrowDown} 
                      className="mr-1" 
                    />
                    {Math.abs(analyticsData.visitorsData.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faEye} className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Giá trị đơn hàng trung bình</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(analyticsData.averageOrderValue.value)}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${analyticsData.averageOrderValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon 
                      icon={analyticsData.averageOrderValue.change >= 0 ? faArrowUp : faArrowDown} 
                      className="mr-1" 
                    />
                    {Math.abs(analyticsData.averageOrderValue.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faShoppingBag} className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Device Distribution & Monthly Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Device Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Phân bố thiết bị</h3>
            </div>
            <div className="p-6">
              {analyticsData.deviceDistribution.map((item) => (
                <div key={item.device} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={item.icon} className="text-indigo-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{item.device}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Data Graph */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Dữ liệu theo tháng</h3>
            </div>
            <div className="p-6">
              <div className="h-72 flex items-end space-x-2">
                {analyticsData.monthlyData.map((item) => {
                  // Normalize the heights for the chart (max height: 200px)
                  const maxSales = Math.max(...analyticsData.monthlyData.map(d => d.sales));
                  const salesHeight = (item.sales / maxSales) * 180;
                  
                  return (
                    <div key={item.month} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-indigo-100 rounded-t-sm" style={{ height: `${salesHeight}px` }}>
                        <div 
                          className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-colors cursor-pointer relative group"
                          style={{ height: '100%' }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 whitespace-nowrap transition-opacity">
                            {formatCurrency(item.sales)}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 mt-1">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Kênh lưu lượng hàng đầu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kênh
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt truy cập
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chuyển đổi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ chuyển đổi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.topChannels.map((channel, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon 
                            icon={
                              channel.channel === 'Organic Search' ? faGlobe :
                              channel.channel === 'Social Media' ? faUsers :
                              channel.channel === 'Email' ? faEnvelope :
                              faExchangeAlt
                            } 
                            className="text-indigo-600" 
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{channel.channel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{channel.visits.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{channel.conversions}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{channel.convRate}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage; 