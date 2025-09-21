<script>
class CRMApp {
    constructor() {
        this.data = {
            clients: [],
            leads: [],
            payments: [],
            sessions: [],
            notifications: [],
            settings: { theme: 'light', aiEnabled: true }
        };
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboardMetrics();
        this.showPage('dashboard');
        this.loadTheme();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                this.showPage(link.dataset.page);
            });
        });

        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('modalOverlay').addEventListener('click', () => this.closeModal());

        document.getElementById('aiToggle').addEventListener('click', () => this.toggleAIPanel());
        document.getElementById('aiClose').addEventListener('click', () => this.closeAIPanel());
        document.getElementById('aiSend').addEventListener('click', () => this.sendAIMessage());
        document.getElementById('aiInput').addEventListener('keypress', e => { if(e.key==='Enter') this.sendAIMessage(); });

        document.getElementById('addClientBtn').addEventListener('click', () => this.showAddClientModal());
        document.getElementById('addFirstClientBtn').addEventListener('click', () => this.showAddClientModal());
        document.getElementById('addLeadBtn').addEventListener('click', () => this.showAddLeadModal());
        document.getElementById('addPaymentBtn').addEventListener('click', () => this.showAddPaymentModal());
        document.getElementById('addSessionBtn').addEventListener('click', () => this.showAddSessionModal());
        document.getElementById('notificationBell').addEventListener('click', () => this.showNotifications());
    }

    showPage(pageId) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;
        this.updatePageContent(pageId);
    }

    updatePageContent(pageId) {
        switch(pageId){
            case 'dashboard': this.updateDashboardMetrics(); break;
            case 'clients': this.renderClientsList(); break;
            case 'sales': this.renderSalesPipeline(); break;
            case 'payments': this.renderPaymentsList(); break;
            case 'sessions': this.renderSessionsList(); break;
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = current==='light' ? 'dark':'light';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        document.querySelector('.sun-icon').classList.toggle('hidden', newTheme==='dark');
        document.querySelector('.moon-icon').classList.toggle('hidden', newTheme==='light');
        this.data.settings.theme = newTheme;
        this.showToast('Theme updated successfully', 'success');
    }

    loadTheme() {
        const theme = this.data.settings.theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.querySelector('.sun-icon').classList.toggle('hidden', theme==='dark');
        document.querySelector('.moon-icon').classList.toggle('hidden', theme==='light');
    }

    updateDashboardMetrics() {
        document.getElementById('totalClients').textContent = this.data.clients.length;
        document.getElementById('activeSessions').textContent = this.data.sessions.filter(s=>s.status==='scheduled').length;
        document.getElementById('pendingPayments').textContent = this.data.payments.filter(p=>p.status==='pending').length;
        document.getElementById('activeLeads').textContent = this.data.leads.filter(l=>l.stage!=='won' && l.stage!=='lost').length;
    }

    // Client Management
    showAddClientModal() {
        const modalContent = `<div class="modal-header">
            <h3>Add New Client</h3>
            <button class="modal-close" onclick="app.closeModal()">&times;</button>
        </div>
        <form class="modal-form" onsubmit="app.addClient(event)">
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" class="form-control" required>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                <button type="submit" class="btn btn--primary">Add Client</button>
            </div>
        </form>`;
        this.showModal(modalContent);
    }

    addClient(e){
        e.preventDefault();
        const form = new FormData(e.target);
        const client = {
            id: Date.now(),
            name: form.get('name'),
            email: form.get('email'),
            phone: form.get('phone'),
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        this.data.clients.push(client);
        this.closeModal();
        this.showToast('Client added successfully!', 'success');
        if(this.currentPage==='clients') this.renderClientsList();
        this.updateDashboardMetrics();
    }

    renderClientsList() {
        const clientsList = document.getElementById('clientsList');
        if(this.data.clients.length===0){
            clientsList.innerHTML = `<div class="empty-state">
                <h3>No clients yet</h3>
                <button class="btn btn--primary" onclick="app.showAddClientModal()">Add Your First Client</button>
            </div>`;
            return;
        }
        const html = this.data.clients.map(c => `
            <div class="client-card card">
                <div class="card__body">
                    <div class="client-info">
                        <h4>${c.name}</h4>
                        <p>${c.email}</p>
                        <p>${c.phone}</p>
                    </div>
                    <div class="client-actions">
                        <button onclick="event.stopPropagation(); app.deleteClient(${c.id})">Delete</button>
                    </div>
                </div>
            </div>`).join('');
        clientsList.innerHTML = html;
    }

    deleteClient(id){
        if(confirm('Delete this client?')){
            this.data.clients = this.data.clients.filter(c=>c.id!==id);
            this.renderClientsList();
            this.updateDashboardMetrics();
            this.showToast('Client deleted successfully','success');
        }
    }

    // Modal
    showModal(content){ 
        const modal=document.getElementById('modal');
        modal.querySelector('#modalContent').innerHTML=content;
        modal.classList.remove('hidden');
    }
    closeModal(){ document.getElementById('modal').classList.add('hidden'); }

    // Toast
    showToast(msg,type='info'){
        const container=document.getElementById('toastContainer');
        const toast=document.createElement('div');
        toast.className=`toast ${type}`;
        toast.innerHTML=`<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(()=>toast.remove(),4000);
    }

    // Notifications
    showNotifications(){ alert('Notifications:\nWelcome to your CRM'); }

    // AI (simplified)
    toggleAIPanel(){ document.getElementById('aiPanel').classList.toggle('hidden'); }
    closeAIPanel(){ document.getElementById('aiPanel').classList.add('hidden'); }
    sendAIMessage(){ alert('AI response placeholder'); }
}

let app;
document.addEventListener('DOMContentLoaded',()=>{ app=new CRMApp(); });
</script>
