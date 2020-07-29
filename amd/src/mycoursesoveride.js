// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Local plugin "Boost navigation fumbling" - JS code for collapsing nav drawer nodes
 *
 * @package    local_boostnavigation
 * @copyright  2017 Kathrin Osswald, Ulm University <kathrin.osswald@uni-ulm.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */



define(
    [
        'jquery',
        'core/templates'
    ],
    function(
        $,
        Templates
    ) {
    "use strict";


    /**
     * Click handler to toggle the given nav node.
     * @param {Object} node The nav node which should be toggled.
     * @param {string} nodename The nav node's nodename.
     */
    function toggleClickHandler(node, nodename) {
        node.click(function(e) {
            // Prevent that the browser opens the node's default action link (if existing).
            e.preventDefault();

            // If the parent node is currently expanded.
            if (node.attr('data-collapse') == 0) {

                // Collapse the node.
                collapseNode(node);
                

                // If the parent node is currently collapsed.
            } else if (node.attr('data-collapse') == 1) {
                // Expand the node.
                expandNode(node);
                
            }
        });

        //if parent mycourses is changed past courses need to reflect those changes
        $('.list-group-item[data-key="mycourses"]').click(function(e) {  
            collapseNode(node);
        });
    }

    /**
     * Helper function to collapse the given nav node.
     * @param {Object} node The nav node which should be toggled.
     * @param {string} nodename The nav node's nodename.
     */
    function collapseNode(node) {

        // Set the hidden attribute to true for all elements which have the nodename as their data-parent-key attribute.
        $('.list-group-item[data-past="true"]').attr("data-hidden", "1");
        // Change the collapse attribute of the node itself to true.
        node.attr("data-collapse", "1");
        // Change the aria-expanded attribute of the node itself to false.
        node.attr("aria-expanded", "0");
        //change arrow 
        node.find(".fa-caret-down").addClass("fa-caret-right");
        node.find(".fa-caret-right").removeClass("fa-caret-down");
     }

    /**
     * Helper function to expand the given nav node.
     * @param {Object} node The nav node which should be toggled.
     * @param {string} nodename The nav node's nodename.
     */
    function expandNode(node) {
        // Set the hidden attribute to false for all elements which have the nodename as their data-parent-key attribute.
        $('.list-group-item[data-past="true"]').attr("data-hidden", "0");
        // Change the collapse attribute of the node itself to false.
        node.attr("data-collapse", "0");
        // Change the aria-expanded attribute of the node itself to true.
        node.attr("aria-expanded", "1");
        //change arrow
        node.find(".fa-caret-right").addClass("fa-caret-down");
        node.find(".fa-caret-down").removeClass("fa-caret-right");
    }

    /**
     * Add aria-attributes to a parent node.
     * @param {Object} node The nav node which should get the aria-attributes.
     * @param {string} nodename The nav node's nodename.
     */
    function addAriaToParent(node, nodename) {
        // Add ids to the child nodes for referencing in aria-controls.
        // Initialize string variable to remember the child node ids.
        var ids = '';
        // Get the elements which have the nodename as their data-parent-key attribute.
        $('.list-group-item[data-past="true"]').each(function(index, element) {
            // Get its data-key attribute (which should be unique) to be used as id attribute.
            var id = $(element).attr('data-key');

            // Prefix the id attribute if it wasn't built by us (or by our companion plugin local_boostcoc).
            if (id.substring(0, 10) !== 'localboost') {
                id = 'localboostnavigation' + id;
            }

            // Set the id attribute.
            $(element).attr('id', id);
            // Remember the id attribute for later use.
            ids = ids + id + ' ';
        });

        // Add aria-controls attribute if we have ids to reference.
        if (ids !== '') {
            node.attr('aria-controls', ids.trim());
        }

        // Add aria-expanded attribute.
        // If the parent node is currently expanded.
        if (node.attr('data-collapse') == 0) {
            // Set the aria-expanded attribute of the node itself to false.
            node.attr('aria-expanded', '1');

            // If the parent node is currently collapsed.
        } else if (node.attr('data-collapse') == 1) {
            // Set the aria-expanded attribute of the node itself to true.
            node.attr('aria-expanded', '0');
        }
    }

    /**
     * Add accessibility to a div node which doesn't behave like an a node.
     * @param {Object} node The nav node which should be made tabbable.
     */
    function tabbableDiv(node) {
        // Add tabindex attribute so that it will be respected by the browser when the user tabs through the page's elements.
        node.attr('tabindex', '0');

        // Also call the click handler when the user presses the Enter button.
        node.keydown(function(e) {
            if (e.which === 13) {
                e.currentTarget.click();
            }
        });

        // As we added a tabindex attribute, the element gets an element focus outline as soon as it's clicked, too.
        // Try to prevent this hereby.
        node.mousedown(function() {
            node.css('outline', 'none');
        });
        node.mouseup(function() {
            node.css('outline', '');
            node.blur();
        });
    }

    /**
     * Init function of this AMD module which initializes the click handlers.
     * @param {string} nodename The nav node's nodename.
     */
    function initToggleNodes(nodename) {
        // Search node to be collapsible.
        var node = $('.list-group-item[data-key="' + nodename + '"]');

        // Add a click handler to this node.
        toggleClickHandler(node, nodename);

        // Add aria-attributes to this node.
        addAriaToParent(node, nodename);

        tabbableDiv(node); 
    }



    /**
     * Create a past course drop down section in mycourses
     * @param {object} node of mycourses
     * @param {array} pastnodes array of objects containing all nodes needing to be placed in past courses
     */
    function createPastNode(node,pastnodes) {
       
        var icon =[];
        icon.push({'pix':'i/moremenu','alt':"",'component':"moodle"});
        var divarray = {};
        divarray['key']='mycoursespast';
        divarray['isexpandable']=1;
        divarray['get_indent']=1;
        divarray['showdivider']=0;
        divarray['type']=0;
        divarray['nodetype']=1;
        divarray['collapse']=1;
        divarray['forceopen']=1;
        divarray['isactive']=0;
        divarray['hidden']=0;
        divarray['preceedwithhr']=0;
        divarray['parent']="mycourses";
        divarray['text']="Past courses"; 
        divarray["icon"]=icon;

       Templates.render('local_boostnavigation/mycoursesoveride', divarray).then(function(html) {
       
            node.after(html);
            //add in nodes under label
            fillPastNode(pastnodes); 
        });
    }

     /**
     * Fill nodes into mycoursespast 
     * @param {array} nodes Array of past nodes
     */
    function fillPastNode(nodes) {
    
        var past = $('.list-group-item[data-key="mycoursespast"]');

        for(var i=0; i<nodes.length; i++){

            //used for fomating the new section
            nodes[i]['get_indent']=2;
            nodes[i].past=true;
            nodes[i].hidden=1;
   
            Templates.render('local_boostnavigation/mycoursesoveride', nodes[i]).then(function(html) {
                past.after(html);  
            });
        }

        $.when.apply($, nodes).done(function() {
            // do things that need to wait until ALL gets are done
            //register event handlers
            initToggleNodes("mycoursespast"); 
        });
    }

     /**
     * Fill in all future and current nodes
     * @param {array} childNodes object array with all current and future
     * @param {object array} node parent mycourses node
     */
    function fillCurrentNode(childNodes,node) {

        
        var nodes = $('.list-group-item[data-parent-key="mycourses"]');
        //create an array for all nodes with an enddate to be moved into past section
        var pastnodes =[];

        nodes.remove();

        for(var i=0; i<childNodes.length; i++){

            //add furture tab for whiteout class in template
            if(childNodes[i].enddate  != 0 && childNodes[i].enddate  != undefined && childNodes[i].enddate < Math.floor(Date.now() / 1000) ){
                //if end date exists save in past array to place at end
                pastnodes.push(childNodes[i]);

            }else{
                Templates.render('local_boostnavigation/mycoursesoveride', childNodes[i]).then(function(html) {
                    node.after(html);  
                });
            }
        }

        return pastnodes;
    }


    return {
        init: function(childNodes) {

            var node = $('.list-group-item[data-key="mycourses"]');
            var pastnodes = fillCurrentNode(childNodes,node );
            if(pastnodes.length >0){
                createPastNode(node, pastnodes); 
            }

        }
    };
});
