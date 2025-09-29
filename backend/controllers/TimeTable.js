class Timetable {
    createPeriod = async (req, res) => {
         const { className, day } = req.params;
         const { subject, teacher, isLab, duration } = req.body;
     
         const timetable = await Timetable.findOne({ className });
         if (!timetable) return res.status(404).json({ message: "Timetable not found" });
     
         const targetDay = timetable.week.find(d => d.day === day);
         if (!targetDay) return res.status(404).json({ message: "Day not found" });
     
         const used = targetDay.periods.reduce((sum, p) => sum + p.duration, 0);
         if (used + duration > targetDay.maxPeriods) {
             return res.status(400).json({ message: "Exceeds max periods" });
         }
     
         targetDay.periods.push({ subject, teacher, isLab, duration });
         await timetable.save();
     
         res.status(201).json({ message: "Period added", timetable });
   };

   getPeriods = async (req, res) => {
        const { className, day } = req.params;
    
        const timetable = await Timetable.findOne({ className });
        if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    
        const targetDay = timetable.week.find(d => d.day === day);
        if (!targetDay) return res.status(404).json({ message: "Day not found" });
    
        res.json(targetDay.periods);
    };

    updatePeriod = async (req, res) => {
        const { className, day, periodId } = req.params;
        const updates = req.body;
    
        const timetable = await Timetable.findOne({ className });
        if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    
        const targetDay = timetable.week.find(d => d.day === day);
        if (!targetDay) return res.status(404).json({ message: "Day not found" });
    
        const period = targetDay.periods.id(periodId);
        if (!period) return res.status(404).json({ message: "Period not found" });
    
        Object.assign(period, updates);
        await timetable.save();
    
        res.json({ message: "Period updated", period });
    };

    deletePeriod = async (req, res) => {
        const { className, day, periodId } = req.params;
    
        const timetable = await Timetable.findOne({ className });
        if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    
        const targetDay = timetable.week.find(d => d.day === day);
        if (!targetDay) return res.status(404).json({ message: "Day not found" });
    
        const period = targetDay.periods.id(periodId);
        if (!period) return res.status(404).json({ message: "Period not found" });
    
        period.remove();
        await timetable.save();
    
        res.json({ message: "Period deleted" });
    };
    
    markTeacherAbsent = async (req, res) => {
        const { className, date, teacher } = req.body;
    
        const timetable = await Timetable.findOne({ className });
        if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    
        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
        const targetDay = timetable.week.find(d => d.day === dayName);
        if (!targetDay) return res.status(404).json({ message: "Day not found" });
    
        targetDay.periods.forEach(period => {
            if (period.teacher === teacher) {
                period.status = "Absent";
            }
        });
    
        await timetable.save();
    
        res.json({ message: `All periods for ${teacher} on ${date} marked absent`, targetDay });
    };
}

export default new Timetable();