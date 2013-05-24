(function ( $ ) {
    $.fn.dragAndDraw = function(options) {
        
        var $settings = $.extend({
            initialPosition: [0,0],
            grid : false,
            top : null,
            left : null,
            width : null,
            minWidth : null,
            height : null,
            start: null,
            stop: null,
            class: null,
            timeout : 0
        }, options );
        
        var $drawing = false;
        var $drawSpace = null;
        var $origin = [];
        var $current = [];
        var $fakeDiv = null;
        var $timeOut = null;
        
        // Functions
        
        var createFakeDiv = function(e){
            setOrigin(e);
            $fakeDiv = $("<div/>").appendTo($drawSpace).css({
                "left" : $origin["x"],
                "top" : $origin["y"]
            }).addClass("draw-temporary");
            if($settings.class !== null)
                $fakeDiv.addClass($settings.class);
            if($settings.content !== null)
                $fakeDiv.html($settings.content);
        }
        
        var gridPosition = function($positions){
            if($settings.grid[0] !== null)
                $positions.x = Math.round($positions.x/$settings.grid[0]) * $settings.grid[0];
            if($settings.grid[1] !== null)
                $positions.y = Math.round($positions.y/$settings.grid[1]) * $settings.grid[1];
            return $positions;
        }
        
        var getMousePosition = function(e){
            $position = {
                x : e.pageX - $($drawSpace).position().left,
                y : e.pageY - $($drawSpace).position().top
            }
            if($settings.grid){
                $position = gridPosition($position);
            }
            
            return $position;
        }
        
        var setOrigin = function(e){
            $position = getMousePosition(e);
            
            if($settings.top !== null)
                $origin["y"] = $settings.top;
            else
                $origin["y"] = $position.y;
            if($settings.left !== null)
                $origin["x"] = $settings.left;
            else
                $origin["x"] = $position.x;
            
        }
        
        var setCurrent = function(e){
            $position = getMousePosition(e);
            
            if($settings.height !== null)
                $current["y"] = $origin["y"] + $settings.height;
            else
                $current["y"] = $position.y;
            
            if($settings.width !== null)
                $current["x"] = $origin["x"] + $settings.width;
            else
                $current["x"] = $position.x;
            
        }
        
        var updateFakeDiv = function(e){
            setCurrent(e);
            $width = $current["x"] - $origin["x"];
            if($settings.minWidth !== null && $width < $settings.minWidth){
                $width = $settings.minWidth;
            }
            $fakeDiv.css({
                "width" : $width,
                "height" : $current["y"] - $origin["y"]
            })
        }
        
        // Triggers
        
        $(document).on("mousemove", function(e){
            if($drawing){
                updateFakeDiv(e);
            }
        });
        
        this.on("mousedown", function(e){
            $drawSpace = e.target;
            $timeOut = setTimeout(function(){
                $drawing = true;
                createFakeDiv(e);
                updateFakeDiv(e);
                if($settings.start !== null)
                    $settings.start($(this), $fakeDiv);
            }, $settings.timeout);
        });
        
        this.on("mouseup", function(){
            clearTimeout($timeOut);
            if($fakeDiv !== null){
                $drawing = false;
                $fakeDiv.removeClass("draw-temporary");
                if($settings.stop !== null)
                    $settings.stop($(this), $fakeDiv);
            }
            $fakeDiv = null;
        });
        
        return this;
    };
}( jQuery ));