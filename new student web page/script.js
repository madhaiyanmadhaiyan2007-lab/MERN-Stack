// ===== Data Storage =====
let user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Student Pro',
    level: 1,
    xp: 0,
    streak: 0,
    lastActive: new Date().toDateString()
};

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let grades = JSON.parse(localStorage.getItem('grades')) || [];
let flashcardDecks = JSON.parse(localStorage.getItem('flashcardDecks')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let achievements = JSON.parse(localStorage.getItem('achievements')) || initializeAchievements();

let currentPage = 'dashboard';
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let activeSounds = {};

// ===== Achievement System =====
function initializeAchievements() {
    return [
        { id: 1, name: 'First Steps', description: 'Create your first task', icon: 'fa-walking', unlocked: false, xp: 10 },
        { id: 2, name: 'Task Master', description: 'Complete 10 tasks', icon: 'fa-check-double', unlocked: false, xp: 50 },
        { id: 3, name: 'Early Bird', description: 'Complete a task before 8 AM', icon: 'fa-sun', unlocked: false, xp: 25 },
        { id: 4, name: 'Night Owl', description: 'Study after 10 PM', icon: 'fa-moon', unlocked: false, xp: 25 },
        { id: 5, name: 'Scholar', description: 'Achieve 3.5+ GPA', icon: 'fa-graduation-cap', unlocked: false, xp: 100 },
        { id: 6, name: 'Dedicated', description: 'Maintain 7 day streak', icon: 'fa-fire', unlocked: false, xp: 75 },
        { id: 7, name: 'Focused Mind', description: 'Complete 5 pomodoro sessions', icon: 'fa-brain', unlocked: false, xp: 50 },
        { id: 8, name: 'Goal Getter', description: 'Complete your first goal', icon: 'fa-bullseye', unlocked: false, xp: 50 },
        { id: 9, name: 'Flash Master', description: 'Create 50 flashcards', icon: 'fa-layer-group', unlocked: false, xp: 75 },
        { id: 10, name: 'Perfectionist', description: 'Get 5 A grades', icon: 'fa-star', unlocked: false, xp: 100 },
        { id: 11, name: 'Productive', description: 'Complete 5 tasks in one day', icon: 'fa-rocket', unlocked: false, xp: 50 },
        { id: 12, name: 'Consistent', description: 'Study every day for a month', icon: 'fa-calendar-check', unlocked: false, xp: 150 },
        { id: 13, name: 'Visionary', description: 'Create your first mind map', icon: 'fa-project-diagram', unlocked: false, xp: 25 },
        { id: 14, name: 'Overachiever', description: 'Reach level 10', icon: 'fa-trophy', unlocked: false, xp: 200 },
        { id: 15, name: 'Legend', description: 'Unlock all achievements', icon: 'fa-crown', unlocked: false, xp: 500 }
    ];
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventListeners();
    updateStreak();
    renderDashboard();
    renderAchievements();
});

function initializeApp() {
    updateUserProfile();
    updateCounts();
    
    // Set greeting based on time
    const hour = new Date().getHours();
    let greeting = 'Ready to achieve your goals today?';
    if (hour < 12) greeting = 'Good morning! Ready to start fresh? ☀️';
    else if (hour < 18) greeting = 'Good afternoon! Keep up the momentum! 🚀';
    else greeting = 'Good evening! Time to reflect and plan! 🌙';
    
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = greeting;
}

// ===== Event Listeners =====
function attachEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(item.dataset.page);
        });
    });
    
    // Mobile menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Modal buttons
    document.getElementById('addTaskBtn')?.addEventListener('click', () => openModal('taskModal'));
    document.getElementById('addGradeBtn')?.addEventListener('click', () => openModal('gradeModal'));
    document.getElementById('addDeckBtn')?.addEventListener('click', () => openModal('deckModal'));
    document.getElementById('addGoalBtn')?.addEventListener('click', () => openModal('goalModal'));
    
    // Form submissions
    document.getElementById('taskForm')?.addEventListener('submit', handleTaskSubmit);
    document.getElementById('gradeForm')?.addEventListener('submit', handleGradeSubmit);
    document.getElementById('deckForm')?.addEventListener('submit', handleDeckSubmit);
    document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);
    
    // Timer controls
    document.getElementById('startTimer')?.addEventListener('click', toggleTimer);
    document.getElementById('resetTimer')?.addEventListener('click', resetTimer);
    
    document.querySelectorAll('.timer-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            document.querySelectorAll('.timer-preset').forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            timerSeconds = parseInt(preset.dataset.minutes) * 60;
            updateTimerDisplay();
        });
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTasks(tab.dataset.filter);
        });
    });
    
    // AI Assistant
    document.getElementById('aiSendBtn')?.addEventListener('click', sendAIMessage);
    document.getElementById('aiInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });
    
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('aiInput').value = btn.dataset.prompt;
            sendAIMessage();
        });
    });
    
    // Sound cards
    document.querySelectorAll('.sound-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            const sound = card.dataset.sound;
            toggleSound(sound);
        });
    });
    
    // Add card button
    document.getElementById('addCardBtn')?.addEventListener('click', () => {
        const container = document.getElementById('cardsContainer');
        const cardInput = document.createElement('div');
        cardInput.className = 'card-input';
        cardInput.innerHTML = `
            <input type="text" placeholder="Front" class="card-front">
            <input type="text" placeholder="Back" class="card-back">
        `;
        container.appendChild(cardInput);
    });
}

// ===== Page Navigation =====
function switchPage(pageName) {
    currentPage = pageName;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
        
        switch(pageName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'tasks':
                renderTasks('all');
                break;
            case 'grades':
                renderGrades();
                break;
            case 'flashcards':
                renderFlashcardDecks();
                break;
            case 'goals':
                renderGoals();
                break;
            case 'achievements':
                renderAchievements();
                break;
        }
    }
    
    if (sidebar) sidebar.classList.remove('active');
}

// ===== Theme Toggle =====
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('darkTheme', 'true');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('darkTheme', 'false');
        }
    }
}

// Load saved theme
if (localStorage.getItem('darkTheme') === 'true') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = 'fas fa-sun';
}

// ===== User Profile & Gamification =====
function updateUserProfile() {
    document.getElementById('userLevel').textContent = user.level;
    document.getElementById('currentXP').textContent = user.xp;
    
    const maxXP = user.level * 100;
    document.getElementById('maxXP').textContent = maxXP;
    
    const xpPercentage = (user.xp / maxXP) * 100;
    const xpFill = document.getElementById('xpFill');
    if (xpFill) xpFill.style.width = xpPercentage + '%';
    
    // Check for level up
    if (user.xp >= maxXP) {
        levelUp();
    }
    
    saveUser();
}

function addXP(amount) {
    user.xp += amount;
    updateUserProfile();
    showNotification(`+${amount} XP earned! 🎉`);
}

function levelUp() {
    user.level++;
    user.xp = 0;
    updateUserProfile();
    showNotification(`🎊 Level Up! You're now level ${user.level}!`, 'success');
    checkAchievement(14); // Overachiever
}

function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (user.lastActive === today) {
        // Already active today
        return;
    } else if (user.lastActive === yesterday) {
        // Consecutive day
        user.streak++;
        if (user.streak === 7) checkAchievement(6); // Dedicated
    } else if (user.lastActive !== today) {
        // Streak broken
        user.streak = 1;
    }
    
    user.lastActive = today;
    document.getElementById('streakDays').textContent = user.streak;
    saveUser();
}

function saveUser() {
    localStorage.setItem('user', JSON.stringify(user));
}

// ===== Achievement System =====
function checkAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        addXP(achievement.xp);
        saveAchievements();
        showAchievementUnlocked(achievement);
        renderAchievements();
        
        // Check if all achievements unlocked
        if (achievements.every(a => a.unlocked)) {
            checkAchievement(15); // Legend
        }
    }
}

function showAchievementUnlocked(achievement) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.5s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
        <div style="font-weight: 700; margin-bottom: 0.5rem;">Achievement Unlocked!</div>
        <div style="font-size: 0.875rem;">${achievement.name}</div>
        <div style="font-size: 0.75rem; opacity: 0.9; margin-top: 0.25rem;">${achievement.description}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const percentage = Math.round((unlockedCount / totalCount) * 100);
    
    document.getElementById('unlockedCount').textContent = unlockedCount;
    document.getElementById('lockedCount').textContent = totalCount - unlockedCount;
    document.getElementById('completionPercent').textContent = percentage + '%';
    document.getElementById('achievementCount').textContent = unlockedCount;
    
    container.innerHTML = achievements.map(a => `
        <div class="achievement-card ${a.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">
                <i class="fas ${a.icon}"></i>
            </div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-description">${a.description}</div>
            ${a.unlocked ? `<div style="color: #10b981; margin-top: 0.5rem; font-size: 0.875rem;">✓ Unlocked</div>` : ''}
        </div>
    `).join('');
}

function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.querySelector('form')?.reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

window.closeModal = closeModal;
window.switchPage = switchPage;

// ===== Task Management =====
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        hours: parseFloat(document.getElementById('taskHours').value),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    closeModal('taskModal');
    renderTasks('all');
    renderDashboard();
    updateCounts();
    
    addXP(10);
    if (tasks.length === 1) checkAchievement(1); // First Steps
    
    showNotification('Task created successfully! 🎯');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        
        if (task.completed) {
            addXP(20);
            
            const completedCount = tasks.filter(t => t.completed).length;
            if (completedCount === 10) checkAchievement(2); // Task Master
            
            const hour = new Date().getHours();
            if (hour < 8) checkAchievement(3); // Early Bird
            
            const todayCompleted = tasks.filter(t => {
                return t.completed && 
                       new Date(t.createdAt).toDateString() === new Date().toDateString();
            }).length;
            if (todayCompleted >= 5) checkAchievement(11); // Productive
        }
        
        saveTasks();
        renderTasks(document.querySelector('.filter-tab.active')?.dataset.filter || 'all');
        renderDashboard();
        updateCounts();
    }
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks(document.querySelector('.filter-tab.active')?.dataset.filter || 'all');
        renderDashboard();
        updateCounts();
        showNotification('Task deleted');
    }
}

function renderTasks(filter = 'all') {
    const container = document.getElementById('tasksContainer');
    if (!container) return;
    
    let filteredTasks = [...tasks];
    const today = new Date().toDateString();
    const weekLater = new Date(Date.now() + 7 * 86400000).toDateString();
    
    if (filter === 'today') {
        filteredTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === today);
    } else if (filter === 'week') {
        filteredTasks = tasks.filter(t => {
            const due = new Date(t.dueDate);
            return due >= new Date() && due.toDateString() <= weekLater;
        });
    } else if (filter === 'high') {
        filteredTasks = tasks.filter(t => t.priority === 'high' && !t.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTasks.map(task => `
        <div class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}">
            <div class="task-header">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<p style="color: var(--text-secondary); margin: 0.5rem 0;">${task.description}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-badge" style="background: var(--bg-tertiary);">
                            ${task.category}
                        </span>
                        <span class="task-badge" style="background: ${getPriorityColor(task.priority)}20; color: ${getPriorityColor(task.priority)};">
                            ${task.priority} priority
                        </span>
                        ${task.dueDate ? `<span><i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}</span>` : ''}
                        <span><i class="fas fa-clock"></i> ${task.hours}h</span>
                    </div>
                </div>
                <button class="btn-icon" onclick="deleteTask(${task.id})" style="margin-left: auto;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getPriorityColor(priority) {
    return priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981';
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// ===== Grade Management =====
function handleGradeSubmit(e) {
    e.preventDefault();
    
    const grade = {
        id: Date.now(),
        course: document.getElementById('courseName').value,
        grade: parseFloat(document.getElementById('gradeValue').value),
        credits: parseInt(document.getElementById('courseCredits').value),
        semester: document.getElementById('courseSemester').value,
        createdAt: new Date().toISOString()
    };
    
    grades.push(grade);
    saveGrades();
    closeModal('gradeModal');
    renderGrades();
    updateCounts();
    
    addXP(30);
    
    const gpa = calculateGPA();
    if (gpa >= 3.5) checkAchievement(5); // Scholar
    
    const aGrades = grades.filter(g => g.grade === 4.0).length;
    if (aGrades >= 5) checkAchievement(10); // Perfectionist
    
    showNotification('Grade added successfully! 📚');
}

function calculateGPA() {
    if (grades.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    grades.forEach(g => {
        totalPoints += g.grade * g.credits;
        totalCredits += g.credits;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

function renderGrades() {
    const gpaDisplay = document.getElementById('gpaDisplay');
    const gradesGrid = document.getElementById('gradesGrid');
    const currentGPA = document.getElementById('currentGPA');
    
    const gpa = calculateGPA();
    if (gpaDisplay) gpaDisplay.textContent = gpa;
    if (currentGPA) currentGPA.textContent = gpa;
    
    if (!gradesGrid) return;
    
    if (grades.length === 0) {
        gradesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-graduation-cap"></i>
                <p>No grades recorded yet</p>
            </div>
        `;
        return;
    }
    
    gradesGrid.innerHTML = grades.map(g => `
        <div class="grade-card">
            <div class="grade-header">
                <div>
                    <div class="course-name">${g.course}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">${g.semester || 'Current'}</div>
                </div>
                <div class="grade-value">${getLetterGrade(g.grade)}</div>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color); font-size: 0.875rem; color: var(--text-secondary);">
                <span>${g.credits} Credits</span>
                <span>GPA: ${g.grade.toFixed(1)}</span>
            </div>
        </div>
    `).join('');
}

function getLetterGrade(gpa) {
    if (gpa >= 4.0) return 'A';
    if (gpa >= 3.7) return 'A-';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.3) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.7) return 'C-';
    if (gpa >= 1.0) return 'D';
    return 'F';
}

function saveGrades() {
    localStorage.setItem('grades', JSON.stringify(grades));
}

// ===== Flashcard System =====
function handleDeckSubmit(e) {
    e.preventDefault();
    
    const cards = [];
    document.querySelectorAll('.card-input').forEach(input => {
        const front = input.querySelector('.card-front').value;
        const back = input.querySelector('.card-back').value;
        if (front && back) {
            cards.push({ front, back, lastReviewed: null });
        }
    });
    
    const deck = {
        id: Date.now(),
        name: document.getElementById('deckName').value,
        subject: document.getElementById('deckSubject').value || 'General',
        cards: cards,
        createdAt: new Date().toISOString()
    };
    
    flashcardDecks.push(deck);
    saveFlashcardDecks();
    closeModal('deckModal');
    renderFlashcardDecks();
    
    addXP(25);
    
    const totalCards = flashcardDecks.reduce((sum, d) => sum + d.cards.length, 0);
    if (totalCards >= 50) checkAchievement(9); // Flash Master
    
    showNotification('Flashcard deck created! 🎴');
}

function renderFlashcardDecks() {
    const container = document.getElementById('decksGrid');
    if (!container) return;
    
    if (flashcardDecks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-layer-group"></i>
                <p>Create your first flashcard deck!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = flashcardDecks.map(deck => `
        <div class="deck-card subject-${deck.subject.toLowerCase()}">
            <div class="deck-header">
                <div class="deck-icon">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="deck-info">
                    <h3>${deck.name}</h3>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${deck.subject}</div>
                </div>
            </div>
            <div class="deck-stats">
                <span>${deck.cards.length} cards</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(deck.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

function saveFlashcardDecks() {
    localStorage.setItem('flashcardDecks', JSON.stringify(flashcardDecks));
}

// ===== Goals System =====
function handleGoalSubmit(e) {
    e.preventDefault();
    
    const goal = {
        id: Date.now(),
        title: document.getElementById('goalTitle').value,
        description: document.getElementById('goalDescription').value,
        targetDate: document.getElementById('goalDate').value,
        category: document.getElementById('goalCategory').value,
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    goals.push(goal);
    saveGoals();
    closeModal('goalModal');
    renderGoals();
    
    addXP(15);
    showNotification('Goal created! 🎯');
}

function updateGoalProgress(id, progress) {
    const goal = goals.find(g => g.id === id);
    if (goal) {
        goal.progress = progress;
        if (progress >= 100 && !goal.completed) {
            goal.completed = true;
            addXP(50);
            checkAchievement(8); // Goal Getter
            showNotification('🎉 Goal completed! Amazing work!', 'success');
        }
        saveGoals();
        renderGoals();
    }
}

function renderGoals() {
    const container = document.getElementById('goalsGrid');
    if (!container) return;
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <p>Set your first goal and start achieving!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <div>
                    <div class="goal-title">${goal.title}</div>
                    ${goal.description ? `<p style="color: var(--text-secondary); margin-top: 0.5rem;">${goal.description}</p>` : ''}
                </div>
                <span class="task-badge" style="background: var(--bg-tertiary);">${goal.category}</span>
            </div>
            ${goal.targetDate ? `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                <i class="fas fa-calendar"></i> Target: ${formatDate(goal.targetDate)}
            </div>` : ''}
            <div class="goal-progress">
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="progress-text">${goal.progress}% Complete</div>
            </div>
            ${!goal.completed ? `
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" onclick="updateGoalProgress(${goal.id}, ${Math.min(goal.progress + 25, 100)})" style="flex: 1;">
                        +25%
                    </button>
                    <button class="btn btn-primary" onclick="updateGoalProgress(${goal.id}, 100)" style="flex: 1;">
                        Complete
                    </button>
                </div>
            ` : '<div style="color: #10b981; text-align: center; margin-top: 1rem; font-weight: 600;">✓ Completed!</div>'}
        </div>
    `).join('');
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

window.updateGoalProgress = updateGoalProgress;

// ===== Timer Functions =====
function toggleTimer() {
    const startBtn = document.getElementById('startTimer');
    if (!startBtn) return;
    
    if (timerRunning) {
        clearInterval(timerInterval);
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    } else {
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                showNotification('🎉 Pomodoro session complete! Take a break!', 'success');
                addXP(25);
                
                const hour = new Date().getHours();
                if (hour >= 22) checkAchievement(4); // Night Owl
                
                checkAchievement(7); // Focused Mind (simplified)
                updateStreak();
            }
        }, 1000);
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
    timerRunning = !timerRunning;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    const activePreset = document.querySelector('.timer-preset.active');
    timerSeconds = parseInt(activePreset?.dataset.minutes || 25) * 60;
    updateTimerDisplay();
    const startBtn = document.getElementById('startTimer');
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.textContent = display;
}

// ===== Ambient Sounds =====
function toggleSound(sound) {
    if (activeSounds[sound]) {
        // Sound is playing, stop it
        delete activeSounds[sound];
    } else {
        // Start sound (in real implementation, would play audio)
        activeSounds[sound] = true;
        showNotification(`${sound} sound ${activeSounds[sound] ? 'enabled' : 'disabled'}`);
    }
}

// ===== AI Assistant =====
function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('aiChatBox');
    
    if (!input || !chatBox || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    
    // Add user message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-message';
    userMsgDiv.innerHTML = `
        <div class="user-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${userMessage}</p>
        </div>
    `;
    chatBox.appendChild(userMsgDiv);
    
    input.value = '';
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(userMessage);
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'ai-message';
        aiMsgDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${aiResponse}</p>
            </div>
        `;
        chatBox.appendChild(aiMsgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateAIResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('study pattern') || message.includes('analyze')) {
        const completedTasks = tasks.filter(t => t.completed).length;
        return `Based on your data: You've completed ${completedTasks} tasks with an average of ${calculateGPA()} GPA. Your most productive time appears to be in the morning. Consider scheduling important tasks between 9-11 AM for maximum productivity.`;
    }
    
    if (message.includes('schedule') || message.includes('plan')) {
        return `I recommend the following study schedule:
        • Morning (9-11 AM): Focus on complex subjects like Math or Science
        • Afternoon (2-4 PM): Review flashcards and lighter reading
        • Evening (7-9 PM): Work on assignments and projects
        Remember to take 10-minute breaks every hour!`;
    }
    
    if (message.includes('progress') || message.includes('review')) {
        const completedCount = tasks.filter(t => t.completed).length;
        const totalCount = tasks.length;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        return `Great question! You've completed ${percentage}% of your tasks (${completedCount}/${totalCount}). Your current GPA is ${calculateGPA()}. You're on a ${user.streak}-day streak! Keep up the excellent work! 🎉`;
    }
    
    if (message.includes('tips') || message.includes('help')) {
        return `Here are my top study tips for you:
        1. Use the Pomodoro Technique (25 min focus, 5 min break)
        2. Review your flashcards using spaced repetition
        3. Break large tasks into smaller, manageable chunks
        4. Study at consistent times to build a routine
        5. Take care of your health - sleep, exercise, and nutrition matter!`;
    }
    
    if (message.includes('motivation') || message.includes('motivate')) {
        return `You're doing amazing! Remember: "Success is the sum of small efforts repeated day in and day out." You're already at level ${user.level} with ${user.streak} days streak. Every task you complete, every study session, every goal you achieve is progress. Keep going! 💪`;
    }
    
    // Default response
    return `I'm here to help! I can analyze your study patterns, suggest schedules, review your progress, and provide study tips. What would you like to know more about?`;
}

// ===== Dashboard Rendering =====
function renderDashboard() {
    updateCounts();
    renderTodayFocus();
    renderUrgentDeadlines();
    renderRecentAchievements();
    updateAIInsight();
}

function updateCounts() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('currentGPA').textContent = calculateGPA();
    
    const studyHours = tasks.reduce((sum, t) => sum + (t.hours || 0), 0);
    document.getElementById('studyHours').textContent = Math.round(studyHours);
    
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    document.getElementById('achievementCount').textContent = unlockedAchievements;
    
    const taskCount = document.getElementById('taskCount');
    if (taskCount) {
        const pending = tasks.filter(t => !t.completed).length;
        taskCount.textContent = pending;
    }
    
    // Update progress stats
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= new Date()).length;
    const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('overdueTasks').textContent = overdue;
}

function renderTodayFocus() {
    const container = document.getElementById('todayFocus');
    if (!container) return;
    
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate).toDateString() === today
    ).slice(0, 5);
    
    if (todayTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-check"></i>
                <p>No tasks for today</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayTasks.map(task => `
        <div class="task-item" style="padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem;">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${task.title}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                    <span class="task-badge" style="background: ${getPriorityColor(task.priority)}20; color: ${getPriorityColor(task.priority)}; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${task.priority}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderUrgentDeadlines() {
    const container = document.getElementById('urgentDeadlines');
    if (!container) return;
    
    const urgent = tasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) <= new Date(Date.now() + 3 * 86400000)
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
    
    if (urgent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>No urgent deadlines</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = urgent.map(task => `
        <div style="padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 3px solid ${getPriorityColor(task.priority)};">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${task.title}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                <i class="fas fa-calendar"></i> Due ${formatDate(task.dueDate)}
            </div>
        </div>
    `).join('');
}

function renderRecentAchievements() {
    const container = document.getElementById('recentAchievements');
    if (!container) return;
    
    const recent = achievements.filter(a => a.unlocked).slice(-3);
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-medal"></i>
                <p>Complete tasks to earn achievements!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(a => `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 50px; height: 50px; background: var(--gradient-1); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                <i class="fas ${a.icon}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${a.name}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${a.description}</div>
            </div>
        </div>
    `).join('');
}

function updateAIInsight() {
    const insights = [
        "You've been most productive on Wednesdays. Try scheduling important tasks then!",
        "Your study streak is impressive! Consistency is key to success.",
        `With ${calculateGPA()} GPA, you're doing great! Keep up the excellent work!`,
        "Taking regular breaks improves retention. Use the Pomodoro timer!",
        "Morning study sessions seem to work best for you. Keep that routine!",
        `You've completed ${tasks.filter(t => t.completed).length} tasks! Every achievement counts!`,
        "Breaking tasks into smaller chunks helps. Try setting milestones!"
    ];
    
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    const aiInsight = document.getElementById('aiInsight');
    if (aiInsight) aiInsight.textContent = randomInsight;
}

// ===== Utility Functions =====
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }
    
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize charts (simple canvas drawing for demo)
function initializeCharts() {
    // This is a simplified version. In production, use Chart.js or similar
    const canvas = document.getElementById('progressChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Run initialization
setTimeout(initializeCharts, 100);