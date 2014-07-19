# URL access xxx.hmtl -> /xxx/
activate :directory_indexes

set :css_dir, 'style'
set :js_dir, 'script'
set :images_dir, 'img'

# htmlのattributesの囲みを「"」にしたい時はattr_wrapperを設定
set :haml, { :format => :html5, :attr_wrapper => "\"", :ugly => false }

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"

  # リポジトリ名を host に設定しておく
  # こうすることで stylesheet_link_tag などで展開されるパスが
  # /my_project/stylesheets/normalize.css
  # のようになる
  activate :asset_host, host:"/jquery.kerning.js"
end

configure :development do
  activate :livereload
end

# デプロイ設定
activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = 'gh-pages'
end

# helpers do  
# end
