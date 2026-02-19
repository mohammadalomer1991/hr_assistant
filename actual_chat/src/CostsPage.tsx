import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Loader2, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CostsPage.css';

interface CostData {
  totalCost: string;
  tokenUsage: number;
  currency: string;
  period: string;
  note: string;
}

const CostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [costs, setCosts] = useState<CostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchCosts = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/costs');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: CostData = await res.json();
      setCosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cost data');
      console.error('Error fetching costs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, []);

  return (
    <div className="costs-page">
      <div className="costs-container">
        {/* Header */}
        <div className="costs-header">
          <button onClick={() => navigate('/')} className="back-button">
            <ArrowLeft className="back-icon" />
            戻る
          </button>
          <div className="header-content">
            <div className="header-title-section">
              <DollarSign className="page-icon" />
              <h1 className="page-title">AWS Bedrock コスト</h1>
            </div>
            <p className="page-subtitle">
              現在の使用コストとトークン数を確認
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-card">
            <Loader2 className="loading-spinner" />
            <p className="loading-text">コストデータを取得中...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-box">
            <h3 className="error-box-title">エラー</h3>
            <p className="error-box-message">{error}</p>
            <p className="error-box-hint">
              Cost Explorer APIの権限を確認してください
            </p>
            <button onClick={fetchCosts} className="retry-button">
              再試行
            </button>
          </div>
        )}

        {/* Costs Display */}
        {costs && !loading && (
          <>
            {/* Main Cost Card */}
            <div className="main-cost-card">
              <div className="cost-card-header">
                <Calendar className="cost-card-icon" />
                <span className="cost-period">{costs.period}</span>
              </div>
              
              <div className="total-cost-section">
                <p className="cost-label">総コスト</p>
                <h2 className="total-cost">${costs.totalCost}</h2>
                <p className="currency-label">{costs.currency}</p>
              </div>

              <button onClick={fetchCosts} disabled={loading} className="refresh-button">
                <RefreshCw className={`refresh-icon ${loading ? 'spinning' : ''}`} />
                更新
              </button>
            </div>

            {/* Token Usage Card */}
            {costs.tokenUsage > 0 && (
              <div className="token-card">
                <div className="token-header">
                  <TrendingUp className="token-icon" />
                  <h3 className="token-title">トークン使用量</h3>
                </div>
                <p className="token-count">{costs.tokenUsage.toLocaleString()}</p>
                <p className="token-label">tokens</p>
              </div>
            )}

            {/* Info Notice */}
            <div className="info-notice">
              <h4 className="info-title">📋 注意事項</h4>
              <ul className="info-list">
                <li>{costs.note}</li>
                <li>コストデータは1日1回更新されます</li>
                <li>リアルタイムのデータではありません</li>
                <li>AWS Cost Explorerを有効にする必要があります</li>
              </ul>
            </div>

            {/* Cost Breakdown Table */}
            <div className="breakdown-card">
              <h3 className="breakdown-title">コスト詳細</h3>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>値</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>期間</td>
                    <td>{costs.period}</td>
                  </tr>
                  <tr>
                    <td>総コスト</td>
                    <td className="amount">${costs.totalCost}</td>
                  </tr>
                  <tr>
                    <td>通貨</td>
                    <td>{costs.currency}</td>
                  </tr>
                  {costs.tokenUsage > 0 && (
                    <tr>
                      <td>トークン数</td>
                      <td>{costs.tokenUsage.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CostsPage;