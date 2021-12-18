import TaskService from '../../../modules/readme/task-service';

describe('TaskService', () => {
  describe('parseVisibleRule', () => {
    it('should return parsed', () => {
      const taskService = new TaskService();
      const rule = 'targetType == inline && run = true';
      const parsed = taskService.parseVisibleRule(rule);
      expect(parsed).toEqual('targetType IS inline AND run IS true');
    });
  });
});
