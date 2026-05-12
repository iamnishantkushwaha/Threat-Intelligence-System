import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { 
  FileBarChart, 
  Download, 
  Plus, 
  Loader2, 
  FileText, 
  Calendar,
  ExternalLink
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportService.getReports();
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      await reportService.generateReport();
      fetchReports();
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await reportService.downloadReport(reportId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ThreatIQ_Report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Security Reports</h1>
          <p className="text-muted text-sm mt-1">Generate and download comprehensive security posture reports</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={generating}
          className="primary-button flex items-center gap-2"
        >
          {generating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          <span>{generating ? 'Generating...' : 'Generate New Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-muted italic">Accessing archive...</div>
        ) : reports.length === 0 ? (
          <div className="col-span-full glass-card p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-muted">
              <FileBarChart size={32} />
            </div>
            <h3 className="text-xl font-bold">No Reports Yet</h3>
            <p className="text-muted mt-2 max-w-sm">Generate your first security report to see an overview of your protected systems.</p>
          </div>
        ) : reports.map((report) => (
          <div key={report.id} className="glass-card p-6 group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <FileText size={24} />
              </div>
              <button 
                onClick={() => handleDownload(report.id)}
                className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
                title="Download PDF"
              >
                <Download size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer">
              {report.title}
            </h3>
            <p className="text-sm text-muted mb-6 line-clamp-2 leading-relaxed">
              {report.summary}
            </p>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar size={14} />
                {new Date(report.created_at).toLocaleDateString()}
              </div>
              <button 
                onClick={() => handleDownload(report.id)}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                Download PDF
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
