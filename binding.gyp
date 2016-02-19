{
  "targets": [
    {
      "target_name": "lpsolve",
      "sources": [ "lpsolve.cc" ],
      "dependencies": [
        "<(module_root_dir)/lib/binding.gyp:lpsolve"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}