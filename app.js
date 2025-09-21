// CRM Application JavaScript - Fixed Version
class CRMApp {
    constructor() {
        this.data = {
            clients: [],
            leads: [],
            payments: [],
            sessions: [],
            notifications: [],
            settings: {
                theme: 'light',
                aiEnabled: true
            }
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
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal handling
        document.getElementById('modalOverlay').addEventListener('click', () => {
            this.closeModal();
        });

        // AI Assistant
        document.getElementById('aiToggle').addEventListener('click', () => {
            this.toggleAIPanel();
        });

        document.getElementById('aiClose').addEventListener('click', () => {
            this.closeAIPanel();
        });

        document.getElementById('aiSend').addEventListener('click', () => {
            this.sendAIMessage();
        });

        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });

        // Add buttons
        document.getElementById('addClientBtn').addEventListener('click', () => {
            this.showAddClientModal();
        });

        document.getElementById('addFirstClientBtn').addEventListener('click', () => {
            this.showAddClientModal();
        });

        document.getElementById('addLeadBtn').addEventListener('click', () => {
            this.showAddLeadModal();
        });

        document.getElementById('addPaymentBtn').addEventListener('click', () => {
            this.showAddPaymentModal();
        });

        document.getElementById('addSessionBtn').addEventListener('click', () => {
            this.showAddSessionModal();
        });

        // Notification bell
        document.getElementById('notificationBell').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;

        // Update page content based on current data
        this.updatePageContent(pageId);
    }

    updatePageContent(pageId) {
        switch(pageId) {
            case 'dashboard':
                this.updateDashboardMetrics();
                break;
            case 'clients':
                this.renderClientsList();
                break;
            case 'sales':
                this.renderSalesPipeline();
                break;
            case 'payments':
                this.renderPaymentsList();
                break;
            case 'sessions':
                this.renderSessionsList();
                break;
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        // Toggle icons
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (newTheme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
        
        this.data.settings.theme = newTheme;
        this.showToast('Theme updated successfully', 'success');
    }

    loadTheme() {
        const theme = this.data.settings.theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    updateDashboardMetrics() {
        document.getElementById('totalClients').textContent = this.data.clients.length;
        document.getElementById('activeSessions').textContent = this.data.sessions.filter(s => s.status === 'scheduled').length;
        document.getElementById('pendingPayments').textContent = this.data.payments.filter(p => p.status === 'pending').length;
        document.getElementById('activeLeads').textContent = this.data.leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length;
    }

    // Client Management
    showAddClientModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Add New Client</h3>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="app.addClient(event)">
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone *</label>
                    <input type="tel" name="phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Age</label>
                    <input type="number" name="age" class="form-control" min="1" max="120">
                </div>
                <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select name="gender" class="form-control">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Program</label>
                    <select name="program" class="form-control">
                        <option value="">Select Program</option>
                        <option value="Personal Training">Personal Training</option>
                        <option value="Lifestyle Coaching">Lifestyle Coaching</option>
                        <option value="Business Mentoring">Business Mentoring</option>
                        <option value="Nutrition Guidance">Nutrition Guidance</option>
                        <option value="Wellness Coaching">Wellness Coaching</option>
                        <option value="Group Fitness">Group Fitness</option>
                        <option value="Corporate Training">Corporate Training</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="date" name="startDate" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Personal Notes</label>
                    <textarea name="notes" class="form-control" rows="3" placeholder="Any special requirements or notes..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Client</button>
                </div>
            </form>
        `;
        this.showModal(modalContent);
    }

    addClient(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const client = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            age: formData.get('age') || null,
            gender: formData.get('gender') || null,
            program: formData.get('program') || null,
            startDate: formData.get('startDate') || null,
            notes: formData.get('notes') || '',
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        this.data.clients.push(client);
        this.closeModal();
        this.showToast('Client added successfully!', 'success');
        
        // Fix: Ensure dashboard metrics are updated immediately
        this.updateDashboardMetrics();
        
        // If we're on the clients page, refresh the list
        if (this.currentPage === 'clients') {
            this.renderClientsList();
        }
    }

    renderClientsList() {
        const clientsList = document.getElementById('clientsList');
        
        if (this.data.clients.length === 0) {
            clientsList.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h3>No clients yet</h3>
                    <p>Start building your business by adding your first client. All their information, progress, and session history will be tracked here.</p>
                    <button class="btn btn--primary" onclick="app.showAddClientModal()">Add Your First Client</button>
                </div>
            `;
            return;
        }

        const clientsGrid = this.data.clients.map(client => `
            <div class="client-card card hover-lift" onclick="app.showClientDetails(${client.id})">
                <div class="card__body">
                    <div class="client-avatar">
                        ${client.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="client-info">
                        <h4>${client.name}</h4>
                        <p class="client-program">${client.program || 'No program assigned'}</p>
                        <p class="client-contact">${client.email}</p>
                        <p class="client-contact">${client.phone}</p>
                        <div class="client-meta">
                            <span class="status status--success">Active</span>
                            <span class="client-date">Added ${new Date(client.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="client-actions">
                        <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); app.editClient(${client.id})">Edit</button>
                        <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); app.deleteClient(${client.id})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');

        clientsList.innerHTML = `
            <div class="clients-grid">
                ${clientsGrid}
            </div>
        `;
    }

    // Sales Pipeline Management
    showAddLeadModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Add New Lead</h3>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="app.addLead(event)">
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" name="phone" class="form-control">
                </div>
                <div class="form-group">
                    <label class="form-label">Lead Source</label>
                    <select name="source" class="form-control">
                        <option value="Website">Website</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Event">Event</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Interested Program</label>
                    <select name="program" class="form-control">
                        <option value="">Select Program</option>
                        <option value="Personal Training">Personal Training</option>
                        <option value="Lifestyle Coaching">Lifestyle Coaching</option>
                        <option value="Business Mentoring">Business Mentoring</option>
                        <option value="Nutrition Guidance">Nutrition Guidance</option>
                        <option value="Wellness Coaching">Wellness Coaching</option>
                        <option value="Group Fitness">Group Fitness</option>
                        <option value="Corporate Training">Corporate Training</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Estimated Value (₹)</label>
                    <input type="number" name="value" class="form-control" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea name="notes" class="form-control" rows="3" placeholder="Lead qualification notes..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Lead</button>
                </div>
            </form>
        `;
        this.showModal(modalContent);
    }

    addLead(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const lead = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            source: formData.get('source'),
            program: formData.get('program') || '',
            value: parseFloat(formData.get('value')) || 0,
            notes: formData.get('notes') || '',
            stage: 'new',
            createdAt: new Date().toISOString()
        };

        this.data.leads.push(lead);
        this.closeModal();
        this.showToast('Lead added successfully!', 'success');
        this.updateDashboardMetrics();
        
        // If we're on the sales page, refresh the pipeline
        if (this.currentPage === 'sales') {
            this.renderSalesPipeline();
        }
    }

    renderSalesPipeline() {
        const stages = ['new', 'qualified', 'proposal', 'won'];
        
        stages.forEach(stage => {
            const stageLeads = this.data.leads.filter(lead => lead.stage === stage);
            const stageElement = document.getElementById(`${stage}Leads`);
            const countElement = stageElement.parentElement.querySelector('.lead-count');
            
            countElement.textContent = stageLeads.length;
            
            if (stageLeads.length === 0) {
                const emptyMessages = {
                    new: 'No new leads',
                    qualified: 'No qualified leads',
                    proposal: 'No proposals sent',
                    won: 'No deals won yet'
                };
                
                stageElement.innerHTML = `<div class="empty-stage"><p>${emptyMessages[stage]}</p></div>`;
                return;
            }

            // Fix: Properly render lead cards
            const leadsHtml = stageLeads.map(lead => `
                <div class="lead-card" draggable="true" data-lead-id="${lead.id}">
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-info">${lead.email || 'No email'}</div>
                    <div class="lead-info">${lead.program || 'No program'}</div>
                    <div class="lead-info">Source: ${lead.source}</div>
                    ${lead.value > 0 ? `<div class="lead-value">₹${lead.value.toLocaleString()}</div>` : ''}
                </div>
            `).join('');
            
            stageElement.innerHTML = leadsHtml;
            
            // Add drag and drop functionality
            this.setupDragAndDrop(stageElement, stage);
        });
    }

    setupDragAndDrop(stageElement, stage) {
        const leadCards = stageElement.querySelectorAll('.lead-card');
        
        leadCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', card.dataset.leadId);
                card.classList.add('dragging');
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });
        });
        
        stageElement.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        stageElement.addEventListener('drop', (e) => {
            e.preventDefault();
            const leadId = e.dataTransfer.getData('text/plain');
            const lead = this.data.leads.find(l => l.id == leadId);
            
            if (lead && lead.stage !== stage) {
                lead.stage = stage;
                this.renderSalesPipeline();
                this.showToast(`Lead moved to ${stage}`, 'success');
                this.updateDashboardMetrics();
            }
        });
    }

    // Payment Management
    showAddPaymentModal() {
        const clientOptions = this.data.clients.map(client => 
            `<option value="${client.id}">${client.name}</option>`
        ).join('');
        
        const modalContent = `
            <div class="modal-header">
                <h3>Add Payment</h3>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="app.addPayment(event)">
                <div class="form-group">
                    <label class="form-label">Client *</label>
                    <select name="clientId" class="form-control" required>
                        <option value="">Select Client</option>
                        ${clientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Amount (₹) *</label>
                    <input type="number" name="amount" class="form-control" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Payment Method</label>
                    <select name="method" class="form-control">
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Razorpay">Razorpay</option>
                        <option value="Stripe">Stripe</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Payment Date</label>
                    <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-control">
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea name="notes" class="form-control" rows="2" placeholder="Payment notes..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Add Payment</button>
                </div>
            </form>
        `;
        this.showModal(modalContent);
    }

    addPayment(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const payment = {
            id: Date.now(),
            clientId: parseInt(formData.get('clientId')),
            amount: parseFloat(formData.get('amount')),
            method: formData.get('method'),
            date: formData.get('date'),
            status: formData.get('status'),
            notes: formData.get('notes') || '',
            createdAt: new Date().toISOString()
        };

        this.data.payments.push(payment);
        this.closeModal();
        this.showToast('Payment added successfully!', 'success');
        this.updateDashboardMetrics();
        
        if (this.currentPage === 'payments') {
            this.renderPaymentsList();
        }
    }

    renderPaymentsList() {
        const paymentsContent = document.querySelector('.payments-content');
        
        if (this.data.payments.length === 0) {
            paymentsContent.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <h3>No payments recorded</h3>
                    <p>Track all payments and set up EMI schedules for your clients</p>
                    <button class="btn btn--primary" onclick="app.showAddPaymentModal()">Record First Payment</button>
                </div>
            `;
            return;
        }

        const paymentsHtml = this.data.payments.map(payment => {
            const client = this.data.clients.find(c => c.id === payment.clientId);
            const statusClass = payment.status === 'completed' ? 'success' : 
                              payment.status === 'pending' ? 'warning' : 'error';
            
            return `
                <div class="payment-card card">
                    <div class="card__body">
                        <div class="payment-info">
                            <h4>₹${payment.amount.toLocaleString()}</h4>
                            <p class="payment-client">${client ? client.name : 'Unknown Client'}</p>
                            <p class="payment-method">${payment.method}</p>
                            <p class="payment-date">${new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <div class="payment-status">
                            <span class="status status--${statusClass}">${payment.status}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        paymentsContent.innerHTML = `<div class="payments-grid">${paymentsHtml}</div>`;
    }

    // Session Management
    showAddSessionModal() {
        const clientOptions = this.data.clients.map(client => 
            `<option value="${client.id}">${client.name}</option>`
        ).join('');
        
        const modalContent = `
            <div class="modal-header">
                <h3>Schedule Session</h3>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <form class="modal-form" onsubmit="app.addSession(event)">
                <div class="form-group">
                    <label class="form-label">Client *</label>
                    <select name="clientId" class="form-control" required>
                        <option value="">Select Client</option>
                        ${clientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Session Type</label>
                    <select name="type" class="form-control">
                        <option value="1-on-1 Coaching">1-on-1 Coaching</option>
                        <option value="Group Session">Group Session</option>
                        <option value="Online Session">Online Session</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Consultation">Consultation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" name="date" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Time *</label>
                    <input type="time" name="time" class="form-control" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration (minutes)</label>
                    <select name="duration" class="form-control">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60" selected>60 minutes</option>
                        <option value="90">90 minutes</option>
                        <option value="120">120 minutes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" name="location" class="form-control" placeholder="e.g., Studio A, Online, Client's home">
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea name="notes" class="form-control" rows="2" placeholder="Session objectives, special requirements..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn--primary">Schedule Session</button>
                </div>
            </form>
        `;
        this.showModal(modalContent);
    }

    addSession(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const session = {
            id: Date.now(),
            clientId: parseInt(formData.get('clientId')),
            type: formData.get('type'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')),
            location: formData.get('location') || '',
            notes: formData.get('notes') || '',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        this.data.sessions.push(session);
        this.closeModal();
        this.showToast('Session scheduled successfully!', 'success');
        this.updateDashboardMetrics();
        
        if (this.currentPage === 'sessions') {
            this.renderSessionsList();
        }
    }

    renderSessionsList() {
        const sessionsContent = document.querySelector('.sessions-content');
        
        if (this.data.sessions.length === 0) {
            sessionsContent.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h3>No sessions scheduled</h3>
                    <p>Schedule your first coaching session</p>
                    <button class="btn btn--primary" onclick="app.showAddSessionModal()">Schedule First Session</button>
                </div>
            `;
            return;
        }

        const sessionsHtml = this.data.sessions.map(session => {
            const client = this.data.clients.find(c => c.id === session.clientId);
            const statusClass = session.status === 'completed' ? 'success' : 
                              session.status === 'cancelled' ? 'error' : 'info';
            
            return `
                <div class="session-card card">
                    <div class="card__body">
                        <div class="session-info">
                            <h4>${session.type}</h4>
                            <p class="session-client">${client ? client.name : 'Unknown Client'}</p>
                            <p class="session-datetime">${new Date(session.date).toLocaleDateString()} at ${session.time}</p>
                            <p class="session-duration">${session.duration} minutes</p>
                            ${session.location ? `<p class="session-location">${session.location}</p>` : ''}
                        </div>
                        <div class="session-status">
                            <span class="status status--${statusClass}">${session.status}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        sessionsContent.innerHTML = `<div class="sessions-grid">${sessionsHtml}</div>`;
    }

    // AI Assistant
    toggleAIPanel() {
        const aiPanel = document.getElementById('aiPanel');
        aiPanel.classList.toggle('hidden');
    }

    closeAIPanel() {
        document.getElementById('aiPanel').classList.add('hidden');
    }

    sendAIMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addAIMessage(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response, 'assistant');
        }, 1000);
    }

    addAIMessage(message, sender) {
        const messagesContainer = document.getElementById('aiMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message--${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('emi') || message.includes('payment') || message.includes('due')) {
            const pendingPayments = this.data.payments.filter(p => p.status === 'pending');
            if (pendingPayments.length === 0) {
                return "You don't have any pending EMI payments at the moment. Great job staying on top of your finances!";
            }
            return `You have ${pendingPayments.length} pending payment(s). Would you like me to show you the details or help set up reminders?`;
        }
        
        if (message.includes('client') || message.includes('customer')) {
            return `You currently have ${this.data.clients.length} clients in your system. ${this.data.clients.length === 0 ? "Let's add your first client to get started!" : "Your business is growing!"}`;
        }
        
        if (message.includes('session') || message.includes('appointment')) {
            const upcomingSessions = this.data.sessions.filter(s => s.status === 'scheduled' && new Date(s.date) >= new Date());
            return `You have ${upcomingSessions.length} upcoming sessions scheduled. ${upcomingSessions.length === 0 ? "Ready to schedule some new sessions?" : "Keep up the great coaching work!"}`;
        }
        
        if (message.includes('revenue') || message.includes('income') || message.includes('money')) {
            const totalRevenue = this.data.payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
            return `Your total completed payments amount to ₹${totalRevenue.toLocaleString()}. ${totalRevenue === 0 ? "Time to record your first payment!" : "Great work building your business!"}`;
        }
        
        if (message.includes('lead') || message.includes('sales')) {
            const activeLeads = this.data.leads.filter(l => l.stage !== 'won' && l.stage !== 'lost');
            return `You have ${activeLeads.length} active leads in your pipeline. ${activeLeads.length === 0 ? "Let's add some new leads to grow your business!" : "Keep nurturing those leads!"}`;
        }
        
        // Default responses
        const responses = [
            "I'm here to help you manage your CRM. You can ask me about clients, payments, sessions, or leads.",
            "Try asking me things like 'Show me pending payments' or 'How many clients do I have?'",
            "I can help you understand your business metrics and remind you of important tasks.",
            "What would you like to know about your coaching business today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Modal Management
    showModal(content) {
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = content;
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal').classList.add('hidden');
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 
            '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
            '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        
        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // Notification Management
    showNotifications() {
        const notifications = [
            'Welcome to your CRM system!',
            'Start by adding your first client',
            'Set up payment reminders for better cash flow'
        ];
        
        alert('Notifications:\n' + notifications.join('\n'));
    }

    // Utility Methods
    editClient(clientId) {
        const client = this.data.clients.find(c => c.id === clientId);
        if (!client) return;
        
        this.showToast('Edit functionality coming soon!', 'info');
    }
    
    deleteClient(clientId) {
        if (confirm('Are you sure you want to delete this client?')) {
            this.data.clients = this.data.clients.filter(c => c.id !== clientId);
            this.renderClientsList();
            this.updateDashboardMetrics();
            this.showToast('Client deleted successfully', 'success');
        }
    }

    showClientDetails(clientId) {
        const client = this.data.clients.find(c => c.id === clientId);
        if (!client) return;
        
        this.showToast(`Showing details for ${client.name}`, 'info');
    }
}

// Additional CSS for dynamically generated content
const additionalStyles = `
<style>
.client-card, .payment-card, .session-card {
    margin-bottom: var(--space-16);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-standard);
}

.client-card:hover, .payment-card:hover, .session-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.client-card .card__body {
    display: flex;
    align-items: center;
    gap: var(--space-16);
}

.client-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: var(--color-btn-primary-text);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
}

.client-info {
    flex: 1;
}

.client-info h4 {
    margin-bottom: var(--space-4);
    color: var(--color-text);
}

.client-program {
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-4);
}

.client-contact {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
}

.client-meta {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    margin-top: var(--space-8);
}

.client-date {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
}

.client-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.clients-grid, .payments-grid, .sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--space-16);
}

.payment-info h4, .session-info h4 {
    margin-bottom: var(--space-8);
    color: var(--color-text);
}

.payment-client, .session-client {
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-4);
}

.payment-method, .payment-date, .session-datetime, .session-duration, .session-location {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
}

.payment-card .card__body, .session-card .card__body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

@media (max-width: 768px) {
    .clients-grid, .payments-grid, .sessions-grid {
        grid-template-columns: 1fr;
    }
    
    .client-card .card__body {
        flex-direction: column;
        text-align: center;
    }
    
    .client-actions {
        flex-direction: row;
        justify-content: center;
    }
}
</style>
`;

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the CRM app
    app = new CRMApp();
});