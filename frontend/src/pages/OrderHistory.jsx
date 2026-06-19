import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, RefreshCw, X, CheckCircle2, FileText, Printer } from 'lucide-react'

// Mock Data inline for demo
const INITIAL_ORDERS = [
  {
    id: "ORD-8472",
    date: "2024-01-15T10:30:00Z",
    total: 45.00,
    status: "Processing",
    items: [
      { title: "Minimalist Ceramic Vases", quantity: 1, price: 45.00, status: 'Active' }
    ]
  },
  {
    id: "ORD-8400",
    date: "2023-12-20T14:20:00Z",
    total: 125.49,
    status: "Delivered",
    items: [
      { title: "Linen Throw Blanket", quantity: 1, price: 89.99, status: 'Delivered' },
      { title: "Matte Black Pour-Over Kettle", quantity: 1, price: 35.50, status: 'Delivered' }
    ]
  }
]

export default function OrderHistory() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [expanded, setExpanded] = useState(null)
  
  // Return Modal State
  const [returnModal, setReturnModal] = useState({ isOpen: false, orderId: null, itemIdx: null, itemTitle: '' })
  const [returnForm, setReturnForm] = useState({ type: 'return', reason: 'defective', comment: '' })
  const [toastMessage, setToastMessage] = useState('')

  // Invoice Modal State
  const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, order: null })

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .details { margin: 30px 0; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background-color: #f8fafc; padding: 12px 10px; text-align: left; border-bottom: 1px solid #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .totals { float: right; width: 300px; margin-top: 30px; font-size: 14px; }
            .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
            .stamp { border: 3px double #059669; color: #059669; padding: 12px 24px; display: inline-block; font-weight: bold; transform: rotate(-5deg); margin-top: 40px; font-size: 18px; border-radius: 4px; text-transform: uppercase; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <div>
              <h2 style="margin: 0 0 5px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">URBANCART INC.</h2>
              <p style="margin: 0; font-size: 12px; color: #475569;">Curated Goods Marketplace<br>Mumbai, MH, India</p>
            </div>
            <div style="text-align: right;">
              <h1 style="margin: 0 0 5px 0; font-size: 28px; font-weight: 800; color: #0f172a;">TAX INVOICE</h1>
              <p style="margin: 0; font-size: 12px; color: #475569;">Invoice No: <b>${order.id}</b><br>Date: ${new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Billed To:</h3>
              <p style="margin: 0; font-size: 14px; font-weight: 600;">Atharva Kulkarni</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #475569;">123 Customer Lane<br>Mumbai, 400001</p>
            </div>
            <div style="text-align: right;">
              <h3 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Payment Method:</h3>
              <p style="margin: 0; font-size: 14px; font-weight: 600;">UPI Transfer (Settled)</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #475569;">Ref No: TXN-${order.id.replace('ORD-', '')}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 20%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div><span style="color: #64748b;">Subtotal</span><span style="font-family: monospace;">₹${order.total.toFixed(2)}</span></div>
            <div><span style="color: #64748b;">GST (18% Included)</span><span style="font-family: monospace;">₹${(order.total * 0.18).toFixed(2)}</span></div>
            <div><span style="color: #64748b;">Shipping</span><span style="color: #059669; font-weight: 600;">Free</span></div>
            <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; font-weight: bold; font-size: 16px; margin-top: 8px;">
              <span>Grand Total</span><span style="font-family: monospace; color: #059669;">₹${order.total.toFixed(2)}</span>
            </div>
          </div>
          <div class="stamp">
            Paid via UPI
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const toggleExpand = (id) => {
    if (expanded === id) setExpanded(null)
    else setExpanded(id)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-jade text-surface'
      case 'processing': return 'bg-amber text-ink'
      case 'shipped': return 'bg-ink text-surface'
      case 'return requested':
      case 'replacement requested': return 'bg-amber/20 text-amber'
      default: return 'bg-line text-ink'
    }
  }

  const openReturnModal = (orderId, itemIdx, itemTitle) => {
    setReturnModal({ isOpen: true, orderId, itemIdx, itemTitle })
  }

  const handleReturnSubmit = (e) => {
    e.preventDefault()
    const newOrders = [...orders]
    const orderIndex = newOrders.findIndex(o => o.id === returnModal.orderId)
    if (orderIndex > -1) {
      newOrders[orderIndex].items[returnModal.itemIdx].status = returnForm.type === 'return' ? 'Return Requested' : 'Replacement Requested'
      setOrders(newOrders)
    }
    
    setReturnModal({ isOpen: false, orderId: null, itemIdx: null, itemTitle: '' })
    setReturnForm({ type: 'return', reason: 'defective', comment: '' })
    setToastMessage(`Your ${returnForm.type} request has been submitted successfully.`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  return (
    <div className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative">
      <h1 className="text-3xl font-display font-bold mb-8">Order History</h1>

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-jade text-surface px-6 py-3 rounded-md shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="space-y-4 max-w-4xl">
        {orders.map(order => (
          <div key={order.id} className="bg-surface border border-line rounded-md overflow-hidden">
            {/* Header / Summary */}
            <div 
              className="p-4 sm:p-6 cursor-pointer hover:bg-background transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
              onClick={() => toggleExpand(order.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-ink opacity-50 flex-shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <div className="font-mono font-bold">{order.id}</div>
                  <div className="text-sm opacity-60">
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 sm:ml-auto">
                <div className="text-right hidden sm:block">
                  <div className="text-xs uppercase tracking-wider opacity-60 font-bold mb-1">Total</div>
                  <div className="font-mono font-bold">₹{order.total.toFixed(2)}</div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
                
                <div className="text-ink opacity-50">
                  {expanded === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === order.id && (
              <div className="p-4 sm:p-6 border-t border-line bg-background">
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-4">Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm bg-surface p-4 border border-line rounded-md">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="opacity-60 font-mono">{item.quantity}x</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <span className="font-mono font-bold">₹{item.price.toFixed(2)}</span>
                        
                        {item.status && item.status !== 'Active' && item.status !== 'Delivered' ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        ) : order.status === 'Delivered' && (
                          <button 
                            onClick={() => openReturnModal(order.id, idx, item.title)}
                            className="flex items-center gap-1.5 text-xs font-bold text-ink hover:text-jade transition-colors px-3 py-1.5 border border-line rounded-md hover:border-jade"
                          >
                            <RefreshCw size={14} />
                            Return / Replace
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button 
                    onClick={() => setInvoiceModal({ isOpen: true, order })}
                    className="px-4 py-2 border border-line rounded-md text-sm font-medium hover:bg-surface flex items-center gap-1.5 transition"
                  >
                    <FileText size={16} />
                    Invoice
                  </button>
                  <Link 
                    to={`/track-order?orderId=${order.id}`}
                    className="px-4 py-2 bg-ink text-surface rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center justify-center gap-1.5 transition"
                  >
                    <Package size={16} />
                    Track Order
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Return/Replace Modal */}
      {returnModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface rounded-lg max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <h2 className="font-bold text-lg">Return / Replace Item</h2>
              <button onClick={() => setReturnModal({ isOpen: false, orderId: null, itemIdx: null, itemTitle: '' })} className="text-ink opacity-50 hover:opacity-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleReturnSubmit} className="p-6">
              <div className="mb-6">
                <p className="text-sm opacity-60 mb-1">Item to return/replace:</p>
                <p className="font-medium line-clamp-1">{returnModal.itemTitle}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Request Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="requestType" 
                        className="text-jade focus:ring-jade"
                        checked={returnForm.type === 'return'}
                        onChange={() => setReturnForm({...returnForm, type: 'return'})}
                      />
                      <span>Return (Refund)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="requestType" 
                        className="text-jade focus:ring-jade"
                        checked={returnForm.type === 'replace'}
                        onChange={() => setReturnForm({...returnForm, type: 'replace'})}
                      />
                      <span>Replace (Exchange)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Reason</label>
                  <select 
                    className="w-full p-2.5 bg-background border border-line rounded-md focus:outline-none focus:border-jade"
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
                  >
                    <option value="defective">Item is defective or doesn't work</option>
                    <option value="wrong_item">Received the wrong item</option>
                    <option value="damaged">Product/box damaged in transit</option>
                    <option value="changed_mind">No longer needed / Changed my mind</option>
                    <option value="description_mismatch">Item doesn't match description</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Additional Comments (Optional)</label>
                  <textarea 
                    className="w-full p-2.5 bg-background border border-line rounded-md focus:outline-none focus:border-jade min-h-[80px]"
                    placeholder="Provide more details..."
                    value={returnForm.comment}
                    onChange={(e) => setReturnForm({...returnForm, comment: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button 
                  type="button" 
                  onClick={() => setReturnModal({ isOpen: false, orderId: null, itemIdx: null, itemTitle: '' })}
                  className="px-4 py-2 font-medium hover:bg-background rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-jade text-surface font-medium rounded-md hover:bg-opacity-90 active:scale-95 transition-transform"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModal.isOpen && invoiceModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface rounded-lg max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FileText size={20} className="text-jade" />
                Tax Invoice
              </h2>
              <button 
                onClick={() => setInvoiceModal({ isOpen: false, order: null })} 
                className="text-ink opacity-50 hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-lg">UrbanCart Inc.</h3>
                  <p className="opacity-60 text-xs">Curated Goods Marketplace<br />Mumbai, MH, India</p>
                </div>
                <div className="text-right">
                  <span className="bg-jade bg-opacity-10 text-jade px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Paid via UPI
                  </span>
                  <p className="font-mono text-xs font-bold mt-2">{invoiceModal.order.id}</p>
                  <p className="opacity-60 text-xs">{new Date(invoiceModal.order.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-line py-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Billed To</span>
                  <p className="font-semibold mt-1">Atharva Kulkarni</p>
                  <p className="opacity-75 text-xs">123 Customer Lane<br />Mumbai, 400001</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Payment Ref</span>
                  <p className="font-mono text-xs font-bold mt-1">TXN-{invoiceModal.order.id.replace('ORD-', '')}</p>
                  <p className="opacity-75 text-xs">Settled directly via bank</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Items Summary</span>
                <div className="border border-line rounded-md overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-background text-xs uppercase font-bold tracking-wider border-b border-line">
                        <th className="p-3 w-3/5">Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceModal.order.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-line last:border-0">
                          <td className="p-3 font-medium">{item.title}</td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">₹{item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-line pt-4 space-y-2 text-sm flex flex-col items-end">
                <div className="flex justify-between w-64 text-xs opacity-75">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{invoiceModal.order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 text-xs opacity-75">
                  <span>GST (18% Included)</span>
                  <span className="font-mono">₹{(invoiceModal.order.total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 text-xs opacity-75">
                  <span>Shipping</span>
                  <span className="font-mono text-jade font-semibold">Free</span>
                </div>
                <div className="flex justify-between w-64 font-bold text-base border-t border-line pt-2 mt-2">
                  <span>Grand Total</span>
                  <span className="font-mono text-jade">₹{invoiceModal.order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-line bg-background">
              <button 
                type="button" 
                onClick={() => setInvoiceModal({ isOpen: false, order: null })}
                className="px-4 py-2 font-medium hover:bg-surface rounded-md text-sm border border-line bg-surface"
              >
                Close
              </button>
              <button 
                onClick={() => handlePrintInvoice(invoiceModal.order)}
                className="px-6 py-2 bg-jade text-surface font-semibold rounded-md hover:bg-opacity-90 flex items-center gap-1.5 transition text-sm shadow-sm"
              >
                <Printer size={16} />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
