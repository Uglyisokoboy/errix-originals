const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ericprecious38:ericprecious38@cluster0.xruixya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({ email: String });
const User = mongoose.model('User', userSchema);

(async () => {
  const result = await User.deleteMany({ email: 'errixoriginals@gmail.com' });
  console.log('Deleted admin users:', result.deletedCount);
  mongoose.disconnect();
})(); 