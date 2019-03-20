const createStorageService = instance => ({
  listAll: () => instance.listAll(),
});

module.exports = createStorageService;
