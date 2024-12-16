require "lucky_case/string"

Jekyll::Hooks.register :posts, :pre_render do |post|
    post.content = post.content.gsub(/^> \[!(WARNING|NOTE|TIP|\w+)\]\n>(.*?)(?=\n(?!>)|\z)/m) do |match|
      type = $1.downcase
      text = $2.gsub(/^>\s?/, '') # Remove leading > from each line

      "<blockquote class='alert-#{type}'>
          <div>#{type}</div>
          <p>#{text}</p>
      </blockquote>"
    end
end
