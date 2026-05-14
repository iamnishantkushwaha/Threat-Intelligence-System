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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-500 text-sm">Downloadable security analysis and system audit reports.</p>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          disabled={generating}
          className="primary-button text-xs py-2 px-4 flex items-center gap-2 font-bold"
        >
          {generating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          <span>{generating ? 'Generating...' : 'Generate Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 text-sm">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center">
            <FileBarChart size={48} className="mx-auto mb-4 text-slate-700" />
            <h3 className="text-xl font-bold text-white mb-2">No Reports Found</h3>
            <p className="text-slate-500 text-sm">Generate a report to see it here.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="glass-card p-6 flex flex-col hover:border-primary/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <button 
                  onClick={() => handleDownload(report.id)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                  title="Download PDF"
                >
                  <Download size={18} />
                </button>
              </div>
              
              <div className="flex-1 space-y-2 mb-6">
                <h3 className="text-lg font-bold text-white line-clamp-1">{report.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{report.summary}</p>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Calendar size={12} />
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => handleDownload(report.id)}
                  className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider hover:underline"
                >
                  View PDF
                  <ExternalLink size={10} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
