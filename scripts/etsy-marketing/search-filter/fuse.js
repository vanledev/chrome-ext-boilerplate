function createFuseObjArr() {
  const options = {
    threshold: 0,
    ignoreLocation: true,
    useExtendedSearch: true,
  };

  const arr = [
    {
      title: "Old Man's War",
      author: "John Scalzi",
      tags: ["fiction"],
    },
    {
      title: "The Lock Artist",
      author: "Steve",
      tags: ["thriller"],
    },
  ];
  const newFuse = new Fuse(arr, options);


}
createFuseObjArr();
