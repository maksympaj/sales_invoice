const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  bulkDelete: _bulkDelete,
};

async function authenticate({ email, password }) {
  const user = await db.User.scope('withPassword').findOne({
    where: { email },
  });
  if (!user) throw 'Email Address does not exist.';
  if (!user.isActive) throw 'Administrator did not allow you yet.';
  if (!(await bcrypt.compare(password, user.password)))
    throw 'Password is incorrect';

  // authentication successful
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { ...omitPassword(user.get()), token };
}

async function getAll() {
  return await db.User.findAll({
    where: { isDeleted: false },
    order: ['createdAt'],
  });
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  if (
    await db.User.findOne({
      where: { email: params.email },
    })
  )
    throw 'This Email Address is already taken.';
    
  params.password && (params.password = await bcrypt.hash(params.password, 10));
  // save user
  await db.User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);
  // hash password if it was entered
  params.password && (params.password = await bcrypt.hash(params.password, 10));
  // copy params to user and save
  Object.assign(user, params);
  await user.save();
  return omitPassword(user.get());
}

async function _delete(id) {
  // const user = await getUser(id);
  // await user.destroy();

  const user = await getUser(id);
  user.isDeleted = true;
  await user.save();
}

async function _bulkDelete(where) {
  return await db.User.destroy({ where });
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
