import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Heart, Lightbulb, Save, Plus, Trash2, Menu, X, Flower2, Clock, MessageCircle } from 'lucide-react';

const TeacherDayPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodCount, setPeriodCount] = useState(5);
  const [periods, setPeriods] = useState([]);
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allData, setAllData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [showMotivation, setShowMotivation] = useState(true);
  const [beforeSchool, setBeforeSchool] = useState({
    activities: '',
    notes: '',
  });
  const [afterSchool, setAfterSchool] = useState({
    activities: '',
    notes: '',
  });
  const [todoItems, setTodoItems] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('medium');
  const [newTodoCategory, setNewTodoCategory] = useState('materials');
  const [newTodoRecurring, setNewTodoRecurring] = useState('none');
  const [newTodoReminderTime, setNewTodoReminderTime] = useState('09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [todoFilterCategory, setTodoFilterCategory] = useState('all');
  const [todoFilterPriority, setTodoFilterPriority] = useState('all');
  const [customCategories, setCustomCategories] = useState(['materials', 'grading', 'planning', 'admin', 'communication']);
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState(null);

  const motivationalMessages = [
    "You're making a difference in students' lives every single day.",
    "Small moments of kindness create lasting memories.",
    "Progress, not perfection, is what matters.",
    "Your passion for teaching inspires others.",
    "Every student has potential waiting to be unlocked.",
    "Teaching is not about the destination—it's about the journey.",
    "Be the teacher you needed when you were a student.",
    "Your effort today shapes the leaders of tomorrow.",
    "Celebrating small wins leads to big changes.",
    "You're stronger than the challenges you face.",
  ];

  const mindfulnessActivities = {
    teacher: [
      { title: "2-Minute Breathing", description: "Box breathing: 4 in, hold 4, out 4, hold 4. Repeat 4 times.", icon: "🌬️" },
      { title: "Desk Stretch", description: "Neck rolls, shoulder shrugs, seated spinal twist. 3 minutes.", icon: "🧘" },
      { title: "Gratitude Moment", description: "Write 3 things you're grateful for today, no matter how small.", icon: "🙏" },
      { title: "Mini Walk", description: "5-minute walk outside or around the building. Notice 5 things you see.", icon: "🚶" },
      { title: "Hand Massage", description: "Using your thumb, massage the opposite palm. Very calming.", icon: "👐" },
      { title: "Thought Cloud Meditation", description: "Imagine thoughts as clouds passing by. Don't judge them.", icon: "☁️" },
    ],
    class: [
      { title: "Mindful Listening", description: "Students close eyes and listen to 2 min of nature sounds. Discuss feelings.", icon: "👂" },
      { title: "Body Scan", description: "Guide students to notice sensations from toes to head. 3 minutes.", icon: "🧠" },
      { title: "5-4-3-2-1 Grounding", description: "Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.", icon: "🌈" },
      { title: "Gratitude Circle", description: "Sit in circle, each student shares one thing they appreciate about today.", icon: "❤️" },
      { title: "Movement Break", description: "Guided stretches with calming music. 3-5 minutes.", icon: "🎵" },
      { title: "Breathing Exercise", description: "Breathing in: 'I am calm.' Breathing out: 'I let go.' Repeat 5 times.", icon: "🌬️" },
    ],
  };

  const tipsAndTricks = [
    { category: "Classroom Management", text: "Use a visible timer for transitions. Students respond better when they know time limits." },
    { category: "Lesson Planning", text: "The 5-minute rule: Plan the first 5 minutes and last 5 minutes of each lesson carefully." },
    { category: "Student Engagement", text: "Cold call with kindness: Give students 5 seconds of think time before asking them to share." },
    { category: "Self-Care", text: "One thing a day: Choose one small thing to celebrate about your teaching each day." },
    { category: "Behavior", text: "Positive reinforcement works best. Catch students doing something right 3x a day." },
    { category: "Feedback", text: "SBI feedback: Situation, Behavior, Impact. It's constructive and specific." },
    { category: "Communication", text: "Weekly win emails to parents. Share one positive thing about each student." },
    { category: "Time Management", text: "Batch similar tasks: Grading, emails, planning. Your brain works better in focus blocks." },
  ];

  const getPeriodDefaults = () => {
    const templates = {
      4: [
        { name: 'Period 1', time: '9:00 - 10:00', subject: '' },
        { name: 'Period 2', time: '10:00 - 11:00', subject: '' },
        { name: 'Break', time: '11:00 - 11:30', subject: '' },
        { name: 'Period 3', time: '11:30 - 12:30', subject: '' },
      ],
      5: [
        { name: 'Period 1', time: '9:00 - 9:50', subject: '' },
        { name: 'Period 2', time: '9:50 - 10:40', subject: '' },
        { name: 'Period 3', time: '10:40 - 11:30', subject: '' },
        { name: 'Lunch', time: '11:30 - 12:10', subject: '' },
        { name: 'Period 4', time: '12:10 - 1:00', subject: '' },
      ],
      6: [
        { name: 'Period 1', time: '8:30 - 9:15', subject: '' },
        { name: 'Period 2', time: '9:15 - 10:00', subject: '' },
        { name: 'Period 3', time: '10:00 - 10:45', subject: '' },
        { name: 'Break', time: '10:45 - 11:00', subject: '' },
        { name: 'Period 4', time: '11:00 - 11:45', subject: '' },
        { name: 'Period 5', time: '11:45 - 12:30', subject: '' },
      ],
      8: [
        { name: 'Period 1', time: '8:30 - 9:15', subject: '' },
        { name: 'Period 2', time: '9:15 - 10:00', subject: '' },
        { name: 'Period 3', time: '10:00 - 10:45', subject: '' },
        { name: 'Lunch 1', time: '10:45 - 11:25', subject: '' },
        { name: 'Period 4', time: '11:25 - 12:10', subject: '' },
        { name: 'Period 5', time: '12:10 - 12:55', subject: '' },
        { name: 'Lunch 2', time: '12:55 - 1:35', subject: '' },
        { name: 'Period 6', time: '1:35 - 2:20', subject: '' },
      ],
    };
    return templates[periodCount] || templates[5];
  };

  useEffect(() => {
    const saved = localStorage.getItem('teacherPlannerData');
    if (saved) {
      setAllData(JSON.parse(saved));
    }
    initializePeriods();
  }, []);

  useEffect(() => {
    localStorage.setItem('teacherPlannerData', JSON.stringify(allData));
  }, [allData]);

  const initializePeriods = () => {
    if (!allData[currentDate]) {
      const defaults = getPeriodDefaults();
      const newPeriods = defaults.map((period, idx) => ({
        id: Math.random(),
        name: period.name,
        time: period.time,
        subject: period.subject,
        lessonNotes: '',
        studentNotes: '',
        reflection: '',
        editingHeader: false,
      }));
      setAllData(prev => ({
        ...prev,
        [currentDate]: {
          periods: newPeriods,
          beforeSchool: { activities: '', notes: '' },
          afterSchool: { activities: '', notes: '' },
          todos: [],
        },
      }));
      setPeriods(newPeriods);
    } else {
      setPeriods(allData[currentDate].periods || []);
      setBeforeSchool(allData[currentDate].beforeSchool || { activities: '', notes: '' });
      setAfterSchool(allData[currentDate].afterSchool || { activities: '', notes: '' });
      setTodoItems(allData[currentDate].todos || []);
    }
  };

  useEffect(() => {
    initializePeriods();
  }, [currentDate, allData]);

  const updatePeriod = (id, field, value) => {
    const updated = periods.map(p => p.id === id ? { ...p, [field]: value } : p);
    setPeriods(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        ...prev[currentDate],
        periods: updated,
      },
    }));
  };

  const updateBeforeSchool = (field, value) => {
    const updated = { ...beforeSchool, [field]: value };
    setBeforeSchool(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        ...prev[currentDate],
        beforeSchool: updated,
      },
    }));
  };

  const updateAfterSchool = (field, value) => {
    const updated = { ...afterSchool, [field]: value };
    setAfterSchool(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        ...prev[currentDate],
        afterSchool: updated,
      },
    }));
  };

  const sendNotification = (title, options = {}) => {
    if (notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      }
    }
  };

  const addTodoItem = () => {
    if (newTodoText.trim()) {
      const newTodo = {
        id: Math.random(),
        text: newTodoText,
        dueDate: newTodoDueDate,
        priority: newTodoPriority,
        category: newTodoCategory,
        recurring: newTodoRecurring,
        reminderTime: newTodoReminderTime,
        completed: false,
        createdDate: currentDate,
        notes: '',
        attachmentUrl: '',
      };

      if (newTodoRecurring === 'daily') {
        for (let i = 0; i < 7; i++) {
          const date = new Date(newTodoDueDate);
          date.setDate(date.getDate() + i);
          setTodoItems(prev => [...prev, { ...newTodo, id: Math.random(), dueDate: date.toISOString().split('T')[0] }]);
        }
      } else if (newTodoRecurring === 'weekly') {
        for (let i = 0; i < 4; i++) {
          const date = new Date(newTodoDueDate);
          date.setDate(date.getDate() + i * 7);
          setTodoItems(prev => [...prev, { ...newTodo, id: Math.random(), dueDate: date.toISOString().split('T')[0] }]);
        }
      } else {
        setTodoItems(prev => [...prev, newTodo]);
      }

      setNewTodoText('');
      setNewTodoDueDate('');
      setNewTodoPriority('medium');
      setNewTodoCategory('materials');
      setNewTodoRecurring('none');
      setShowTodoForm(false);
      sendNotification('To-Do Added!', { body: newTodoText });
    }
  };

  const toggleTodoComplete = (id) => {
    const updated = todoItems.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodoItems(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        periods: prev[currentDate]?.periods || periods,
        beforeSchool: prev[currentDate]?.beforeSchool || beforeSchool,
        afterSchool: prev[currentDate]?.afterSchool || afterSchool,
        todos: updated,
      },
    }));
  };

  const deleteTodoItem = (id) => {
    const updated = todoItems.filter(t => t.id !== id);
    setTodoItems(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        periods: prev[currentDate]?.periods || periods,
        beforeSchool: prev[currentDate]?.beforeSchool || beforeSchool,
        afterSchool: prev[currentDate]?.afterSchool || afterSchool,
        todos: updated,
      },
    }));
  };

  const applyTemplate = (template) => {
    setNewTodoText(template.text);
    setNewTodoCategory(template.category);
    setNewTodoPriority(template.priority);
    setShowTodoForm(true);
  };

  const addCustomCategory = () => {
    if (newCustomCategory.trim() && !customCategories.includes(newCustomCategory.toLowerCase())) {
      setCustomCategories([...customCategories, newCustomCategory.toLowerCase()]);
      setNewCustomCategory('');
      setShowCustomCategoryForm(false);
      sendNotification('Category Added', { body: newCustomCategory });
    }
  };

  const updateTodoNotes = (todoId, notes) => {
    const updated = todoItems.map(t =>
      t.id === todoId ? { ...t, notes } : t
    );
    setTodoItems(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        periods: prev[currentDate]?.periods || periods,
        beforeSchool: prev[currentDate]?.beforeSchool || beforeSchool,
        afterSchool: prev[currentDate]?.afterSchool || afterSchool,
        todos: updated,
      },
    }));
  };

  const updateTodoAttachment = (todoId, url) => {
    const updated = todoItems.map(t =>
      t.id === todoId ? { ...t, attachmentUrl: url } : t
    );
    setTodoItems(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        periods: prev[currentDate]?.periods || periods,
        beforeSchool: prev[currentDate]?.beforeSchool || beforeSchool,
        afterSchool: prev[currentDate]?.afterSchool || afterSchool,
        todos: updated,
      },
    }));
  };

  const getTaskStats = () => {
    const totalTodos = todoItems.length;
    const completedTodos = todoItems.filter(t => t.completed).length;
    const highPriorityTodos = todoItems.filter(t => t.priority === 'high' && !t.completed).length;
    const overdueTodos = todoItems.filter(t => {
      const isOverdue = t.dueDate && new Date(t.dueDate) < new Date(currentDate) && !t.completed;
      return isOverdue;
    }).length;
    const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    return {
      totalTodos,
      completedTodos,
      highPriorityTodos,
      overdueTodos,
      completionPercentage,
    };
  };

  const bulkMarkComplete = (category = null) => {
    const updated = todoItems.map(t => {
      if (!t.completed && (!category || t.category === category)) {
        return { ...t, completed: true };
      }
      return t;
    });
    setTodoItems(updated);
    setAllData(prev => ({
      ...prev,
      [currentDate]: {
        periods: prev[currentDate]?.periods || periods,
        beforeSchool: prev[currentDate]?.beforeSchool || beforeSchool,
        afterSchool: prev[currentDate]?.afterSchool || afterSchool,
        todos: updated,
      },
    }));
    sendNotification('Tasks Marked Complete!', { body: 'Keep up the great work!' });
  };

  const exportToCalendar = (todo) => {
    if (todo.dueDate) {
      const startDate = new Date(todo.dueDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        todo.text
      )}&dates=${startDate.toISOString().split('T')[0].replace(/-/g, '')}/${endDate
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '')}&details=${encodeURIComponent(
        `Priority: ${todo.priority}\nCategory: ${todo.category}`
      )}`;

      window.open(googleCalendarUrl, '_blank');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const categoryEmoji = {
    materials: '📦',
    grading: '✏️',
    planning: '📋',
    admin: '📋',
    communication: '💬',
  };

  const priorityColor = {
    high: 'bg-red-50 border-l-red-500',
    medium: 'bg-yellow-50 border-l-yellow-500',
    low: 'bg-green-50 border-l-green-500',
  };

  const templates = [
    { text: 'Prepare materials for class', category: 'materials', priority: 'high' },
    { text: 'Grade assignments', category: 'grading', priority: 'high' },
    { text: 'Update gradebook', category: 'grading', priority: 'medium' },
    { text: 'Prepare lesson plans', category: 'planning', priority: 'high' },
    { text: 'Create assessment', category: 'planning', priority: 'medium' },
    { text: 'Collect parent signatures', category: 'admin', priority: 'medium' },
    { text: 'Submit attendance reports', category: 'admin', priority: 'high' },
    { text: 'Prepare report cards', category: 'admin', priority: 'high' },
    { text: 'Email parents about progress', category: 'communication', priority: 'medium' },
    { text: 'Prepare parent-teacher conference notes', category: 'planning', priority: 'high' },
    { text: 'Copy handouts', category: 'materials', priority: 'medium' },
    { text: 'Order supplies', category: 'admin', priority: 'low' },
  ];

  const filteredTodos = todoItems.filter(todo => {
    const categoryMatch = todoFilterCategory === 'all' || todo.category === todoFilterCategory;
    const priorityMatch = todoFilterPriority === 'all' || todo.priority === todoFilterPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f3' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: '#8b6f47' }}>🔔 Between the Bells Teacher Planner</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => setActiveTab('planner')}
              className={`font-semibold transition ${activeTab === 'planner' ? 'text-amber-600' : 'text-gray-600'}`}
            >
              📅 Daily Planner
            </button>
            <button
              onClick={() => setActiveTab('mindfulness')}
              className={`font-semibold transition ${activeTab === 'mindfulness' ? 'text-amber-600' : 'text-gray-600'}`}
            >
              🌸 Mindfulness
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`font-semibold transition ${activeTab === 'tips' ? 'text-amber-600' : 'text-gray-600'}`}
            >
              💡 Tips & Tricks
            </button>
          </nav>

          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-700"
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="md:hidden bg-gray-50 border-t">
            <button
              onClick={() => { setActiveTab('planner'); setSidebarOpen(false); }}
              className={`block w-full text-left px-4 py-2 ${activeTab === 'planner' ? 'bg-amber-100' : ''}`}
            >
              📅 Daily Planner
            </button>
            <button
              onClick={() => { setActiveTab('mindfulness'); setSidebarOpen(false); }}
              className={`block w-full text-left px-4 py-2 ${activeTab === 'mindfulness' ? 'bg-amber-100' : ''}`}
            >
              🌸 Mindfulness
            </button>
            <button
              onClick={() => { setActiveTab('tips'); setSidebarOpen(false); }}
              className={`block w-full text-left px-4 py-2 ${activeTab === 'tips' ? 'bg-amber-100' : ''}`}
            >
              💡 Tips & Tricks
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Motivational Message */}
        {showMotivation && (
          <div className="mb-6 p-6 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl border-2 border-pink-200">
            <div className="flex justify-between items-start">
              <p className="text-lg font-semibold text-gray-800">
                {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
              </p>
              <button
                onClick={() => setShowMotivation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Daily Planner Tab */}
        {activeTab === 'planner' && (
          <div>
            {/* Date and Period Selection */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div>
                  <label className="font-bold text-gray-700">Select Date:</label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="mt-2 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700">Periods:</label>
                  <div className="flex gap-2 mt-2">
                    {[4, 5, 6, 8].map(num => (
                      <button
                        key={num}
                        onClick={() => setPeriodCount(num)}
                        className={`px-4 py-2 rounded-lg font-bold transition ${
                          periodCount === num
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Before School */}
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-xl shadow-md mb-6 border-2 border-yellow-200">
              <h2 className="text-xl font-bold mb-4">🌅 Before School</h2>
              <textarea
                value={beforeSchool.activities}
                onChange={(e) => updateBeforeSchool('activities', e.target.value)}
                placeholder="Activities, clubs, sports, arts..."
                className="w-full p-3 border border-yellow-300 rounded-lg mb-4 resize-none h-24 focus:outline-none focus:border-yellow-500"
              />
              <textarea
                value={beforeSchool.notes}
                onChange={(e) => updateBeforeSchool('notes', e.target.value)}
                placeholder="Notes..."
                className="w-full p-3 border border-yellow-300 rounded-lg resize-none h-20 focus:outline-none focus:border-yellow-500"
              />
            </div>

            {/* Periods */}
            <div className="space-y-4 mb-6">
              {periods.map((period, idx) => (
                <div key={period.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                  {!period.editingHeader ? (
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{period.name}</h3>
                        <p className="text-sm text-gray-600">{period.time}</p>
                        {period.subject && <p className="text-sm font-semibold text-amber-600">{period.subject}</p>}
                      </div>
                      <button
                        onClick={() => updatePeriod(period.id, 'editingHeader', true)}
                        className="text-amber-600 hover:text-amber-800 font-bold text-lg"
                      >
                        ✏️
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                      <input
                        type="text"
                        value={period.name}
                        onChange={(e) => updatePeriod(period.id, 'name', e.target.value)}
                        placeholder="Period name"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={period.time}
                        onChange={(e) => updatePeriod(period.id, 'time', e.target.value)}
                        placeholder="Time (e.g., 9:00 - 10:00)"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={period.subject}
                        onChange={(e) => updatePeriod(period.id, 'subject', e.target.value)}
                        placeholder="Subject/Class"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => updatePeriod(period.id, 'editingHeader', false)}
                        className="w-full px-3 py-2 bg-amber-600 text-white rounded font-bold hover:bg-amber-700"
                      >
                        Done
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-gray-700 text-sm">Lesson Notes:</label>
                      <textarea
                        value={period.lessonNotes}
                        onChange={(e) => updatePeriod(period.id, 'lessonNotes', e.target.value)}
                        placeholder="What will you teach?"
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 text-sm">Student Notes:</label>
                      <textarea
                        value={period.studentNotes}
                        onChange={(e) => updatePeriod(period.id, 'studentNotes', e.target.value)}
                        placeholder="Observations, progress, concerns..."
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 text-sm">Reflection:</label>
                      <textarea
                        value={period.reflection}
                        onChange={(e) => updatePeriod(period.id, 'reflection', e.target.value)}
                        placeholder="How did it go? What worked well?"
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* After School */}
            <div className="bg-gradient-to-r from-orange-100 to-red-50 p-6 rounded-xl shadow-md mb-6 border-2 border-orange-200">
              <h2 className="text-xl font-bold mb-4">🌆 After School</h2>
              <textarea
                value={afterSchool.activities}
                onChange={(e) => updateAfterSchool('activities', e.target.value)}
                placeholder="Activities, clubs, meetings, duties..."
                className="w-full p-3 border border-orange-300 rounded-lg mb-4 resize-none h-24 focus:outline-none focus:border-orange-500"
              />
              <textarea
                value={afterSchool.notes}
                onChange={(e) => updateAfterSchool('notes', e.target.value)}
                placeholder="Notes..."
                className="w-full p-3 border border-orange-300 rounded-lg resize-none h-20 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* To-Do Section */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#8b6f47' }}>✓ To-Do List</h2>

              {/* Notification Toggle */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={requestNotificationPermission}
                  className="w-5 h-5 cursor-pointer"
                />
                <label className="font-semibold text-blue-900">Enable browser notifications</label>
              </div>

              {/* Quick Templates */}
              <div className="mb-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm font-bold text-blue-900 mb-3">🚀 Quick Add (Templates):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {templates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(template)}
                      className="text-xs px-2 py-1 bg-white text-blue-900 rounded border border-blue-300 hover:bg-blue-50 font-semibold transition"
                    >
                      {template.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Statistics */}
              {todoItems.length > 0 && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  {(() => {
                    const stats = getTaskStats();
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-900">{stats.completionPercentage}%</p>
                          <p className="text-xs text-blue-700">Completion</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-900">{stats.completedTodos}/{stats.totalTodos}</p>
                          <p className="text-xs text-green-700">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-900">{stats.highPriorityTodos}</p>
                          <p className="text-xs text-red-700">High Priority</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-900">{stats.overdueTodos}</p>
                          <p className="text-xs text-orange-700">Overdue</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <button
                            onClick={() => bulkMarkComplete()}
                            className="w-full px-3 py-2 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 transition"
                          >
                            Mark All ✓
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Custom Category Management */}
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                {!showCustomCategoryForm ? (
                  <button
                    onClick={() => setShowCustomCategoryForm(true)}
                    className="text-xs font-semibold text-purple-900 hover:text-purple-700"
                  >
                    + Create Custom Category
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCustomCategory}
                      onChange={(e) => setNewCustomCategory(e.target.value)}
                      placeholder="New category name (e.g., Meetings, Projects)"
                      className="flex-1 px-3 py-1 border border-purple-300 rounded text-sm"
                    />
                    <button
                      onClick={addCustomCategory}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-xs font-bold hover:bg-purple-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowCustomCategoryForm(false)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-gray-700">Filter by Category:</label>
                  <select
                    value={todoFilterCategory}
                    onChange={(e) => setTodoFilterCategory(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Categories</option>
                    {customCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-gray-700">Filter by Priority:</label>
                  <select
                    value={todoFilterPriority}
                    onChange={(e) => setTodoFilterPriority(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Add To-Do Form */}
              {!showTodoForm ? (
                <button
                  onClick={() => setShowTodoForm(true)}
                  className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition mb-6 flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add To-Do Item
                </button>
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200 mb-6">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="What do you need to do?"
                    className="w-full px-4 py-2 border border-yellow-300 rounded-lg mb-4 focus:outline-none focus:border-yellow-500"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="date"
                      value={newTodoDueDate}
                      onChange={(e) => setNewTodoDueDate(e.target.value)}
                      className="px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                    <input
                      type="time"
                      value={newTodoReminderTime}
                      onChange={(e) => setNewTodoReminderTime(e.target.value)}
                      className="px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <select
                      value={newTodoPriority}
                      onChange={(e) => setNewTodoPriority(e.target.value)}
                      className="px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>

                    <select
                      value={newTodoCategory}
                      onChange={(e) => setNewTodoCategory(e.target.value)}
                      className="px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                    >
                      {customCategories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>

                    <select
                      value={newTodoRecurring}
                      onChange={(e) => setNewTodoRecurring(e.target.value)}
                      className="px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                    >
                      <option value="none">No Repeat</option>
                      <option value="daily">🔄 Daily</option>
                      <option value="weekly">🔄 Weekly</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={addTodoItem}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      <Plus size={18} className="inline mr-2" /> Add To-Do
                    </button>
                    <button
                      onClick={() => setShowTodoForm(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* To-Do Items */}
              <div className="space-y-3">
                {filteredTodos.length === 0 && todoItems.length > 0 ? (
                  <p className="text-center text-gray-500 py-8">No items match your filters.</p>
                ) : filteredTodos.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No to-do items yet. Add one above!</p>
                ) : (
                  filteredTodos.map(todo => {
                    const isDueToday = todo.dueDate === currentDate;
                    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date(currentDate) && !todo.completed;

                    return (
                      <div key={todo.id} className="mb-3">
                        <div
                          onClick={() => setExpandedTodoId(expandedTodoId === todo.id ? null : todo.id)}
                          className={`p-3 rounded-lg cursor-pointer flex items-start gap-3 border-l-4 transition ${
                            todo.completed
                              ? 'bg-gray-100 opacity-60 border-l-gray-400'
                              : isOverdue
                              ? 'bg-red-50 border-l-red-500 hover:bg-red-100'
                              : isDueToday
                              ? 'bg-yellow-50 border-l-yellow-500 hover:bg-yellow-100'
                              : priorityColor[todo.priority]
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodoComplete(todo.id)}
                            className="mt-1 w-5 h-5 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <p className={`${todo.completed ? 'line-through text-gray-600' : 'text-gray-800'} font-medium`}>
                              {todo.text}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {categoryEmoji[todo.category]} {todo.category}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                todo.priority === 'high' ? 'bg-red-200 text-red-800' :
                                todo.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                              </span>
                              {todo.recurring !== 'none' && (
                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                  🔄 {todo.recurring}
                                </span>
                              )}
                            </div>
                            {todo.dueDate && (
                              <p className="text-xs text-gray-600 mt-2">
                                📅 {new Date(todo.dueDate).toLocaleDateString()} at {todo.reminderTime}
                                {isOverdue && ' (OVERDUE)'}
                                {isDueToday && ' (TODAY)'}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                exportToCalendar(todo);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1 title='Export to Calendar'"
                            >
                              📅
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTodoItem(todo.id);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedTodoId === todo.id && (
                          <div className="p-4 bg-white border border-gray-300 rounded-lg mt-2 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-700">Notes:</label>
                              <textarea
                                value={todo.notes || ''}
                                onChange={(e) => updateTodoNotes(todo.id, e.target.value)}
                                placeholder="Add notes, details, or reminders..."
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded resize-none h-20 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700">Resource Link:</label>
                              <input
                                type="url"
                                value={todo.attachmentUrl || ''}
                                onChange={(e) => updateTodoAttachment(todo.id, e.target.value)}
                                placeholder="e.g., https://drive.google.com/... or https://docs.google.com/..."
                                className="w-full mt-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                              />
                              {todo.attachmentUrl && (
                                
                                  href={todo.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                  🔗 Open Resource
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => bulkMarkComplete(todo.category)}
                                className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Mark {todo.category} Complete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI Lesson Planning Help Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#4f46e5' }}>
                🤖 AI Lesson Planning Help
              </h2>
              <p className="text-gray-700 mb-6">
                Supercharge your lesson planning with AI assistance! Use these powerful tools to create lesson plans, generate ideas, develop assessments, and personalize learning activities.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Claude AI */}
                
                  href="https://claude.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
                >
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Claude AI</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Advanced AI assistant perfect for creating detailed lesson plans, writing rubrics, generating discussion questions, and developing differentiated learning activities.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full font-medium">Best for: Detailed Planning</span>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition">
                    Launch Claude AI →
                  </button>
                </a>

                {/* Google Gemini */}
                
                  href="https://gemini.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
                >
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Google Gemini</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Powerful AI tool for brainstorming lesson ideas, creating engaging content, writing student feedback, and generating creative project prompts.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-medium">Best for: Creative Ideas</span>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
                    Launch Google Gemini →
                  </button>
                </a>

                {/* ChatGPT */}
                
                  href="https://chatgpt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
                >
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ChatGPT</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Versatile AI assistant great for instant lesson planning, creating assessments, writing emails to parents, and providing quick answers to teaching questions.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-100 text-green-900 px-3 py-1 rounded-full font-medium">Best for: Quick Help</span>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition">
                    Launch ChatGPT →
                  </button>
                </a>
              </div>

              {/* AI Use Cases */}
              <div className="mt-8 p-6 bg-white rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">💡 AI Can Help You With:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Lesson Plans</strong> - Create detailed, scaffolded lesson sequences</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Learning Objectives</strong> - Write clear, measurable SMART goals</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Assessments</strong> - Design quizzes, tests, and rubrics</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Differentiation</strong> - Adapt content for diverse learners</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Engaging Activities</strong> - Generate interactive, hands-on tasks</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Parent Communication</strong> - Draft emails and progress reports</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Classroom Management</strong> - Strategies for behavior and engagement</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Content Explanations</strong> - Simple explanations of complex topics</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Discussion Questions</strong> - Higher-order thinking prompts</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Project Ideas</strong> - Cross-curricular, real-world projects</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Feedback</strong> - Personalized student comments and suggestions</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Professional Development</strong> - Teaching tips and strategies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mindfulness Tab */}
        {activeTab === 'mindfulness' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Flower2 size={32} /> Mindfulness & Wellness
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">🧘 For You (Teacher)</h3>
                <div className="space-y-4">
                  {mindfulnessActivities.teacher.map((activity, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.icon} {activity.title}</h4>
                      <p className="text-gray-700">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">👨‍👩‍👧‍👦 For Your Class</h3>
                <div className="space-y-4">
                  {mindfulnessActivities.class.map((activity, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.icon} {activity.title}</h4>
                      <p className="text-gray-700">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips & Tricks Tab */}
        {activeTab === 'tips' && (
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Lightbulb className="inline mr-3" size={28} /> Tips & Tricks
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {tipsAndTricks.map((tip, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">
                    {tip.category}
                  </p>
                  <p className="text-gray-800">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Lesson Planning Help Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#4f46e5' }}>
            🤖 AI Lesson Planning Help
          </h2>
          <p className="text-gray-700 mb-6">
            Supercharge your lesson planning with AI assistance! Use these powerful tools to create lesson plans, generate ideas, develop assessments, and personalize learning activities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Claude AI */}
            
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Claude AI</h3>
              <p className="text-sm text-gray-700 mb-4">
                Advanced AI assistant perfect for creating detailed lesson plans, writing rubrics, generating discussion questions, and developing differentiated learning activities.
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full font-medium">Best for: Detailed Planning</span>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition">
                Launch Claude AI →
              </button>
            </a>

            {/* Google Gemini */}
            
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Google Gemini</h3>
              <p className="text-sm text-gray-700 mb-4">
                Powerful AI tool for brainstorming lesson ideas, creating engaging content, writing student feedback, and generating creative project prompts.
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-medium">Best for: Creative Ideas</span>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
                Launch Google Gemini →
              </button>
            </a>

            {/* ChatGPT */}
            
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ChatGPT</h3>
              <p className="text-sm text-gray-700 mb-4">
                Versatile AI assistant great for instant lesson planning, creating assessments, writing emails to parents, and providing quick answers to teaching questions.
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-green-100 text-green-900 px-3 py-1 rounded-full font-medium">Best for: Quick Help</span>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition">
                Launch ChatGPT →
              </button>
            </a>
          </div>

          {/* AI Use Cases */}
          <div className="mt-8 p-6 bg-white rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 AI Can Help You With:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Lesson Plans</strong> - Create detailed, scaffolded lesson sequences</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Learning Objectives</strong> - Write clear, measurable SMART goals</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Assessments</strong> - Design quizzes, tests, and rubrics</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Differentiation</strong> - Adapt content for diverse learners</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Engaging Activities</strong> - Generate interactive, hands-on tasks</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Parent Communication</strong> - Draft emails and progress reports</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Classroom Management</strong> - Strategies for behavior and engagement</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Content Explanations</strong> - Simple explanations of complex topics</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Discussion Questions</strong> - Higher-order thinking prompts</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Project Ideas</strong> - Cross-curricular, real-world projects</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Feedback</strong> - Personalized student comments and suggestions</span>
              </div>
              <div className="flex gap-2">
                <span className="text-indigo-500 font-bold">✓</span>
                <span><strong>Professional Development</strong> - Teaching tips and strategies</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-200 text-center text-gray-600">
        <p>🔔 <strong>Between the Bells</strong> - Making every moment count</p>
        <p className="text-sm mt-2">💪 You're doing great. Take care of yourself so you can take care of your students.</p>
      </footer>
    </div>
  );
};

export default TeacherDayPlanner;
